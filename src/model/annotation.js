import uuid from 'uuid/v4'

/**
 * Represents a Web Annotation.
 *
 * See https://www.w3.org/TR/annotation-model/
 *
 * Note that as the viewer is not currently responsible for storing the
 * annotations the id is generated as a random UUID. This can later be
 * updated by the client should they decide to send the data to their own
 * annotation server.
 * @param {String} motivation
 *   A motivation from the following section of the spec.
 *   https://www.w3.org/TR/annotation-model/#motivation-and-purpose
 * @param {Object} imgInfo
 *   The IIIF image info.
 * @param {Object} creator
 *   The creator.
 * @param {Object} generator
 *   The generator.
 */
class Annotation {

  constructor (motivation, imgInfo, creator = null, generator = null) {
    this['@context'] = 'http://www.w3.org/ns/anno.jsonld'
    this['id'] = uuid()
    this.type = 'Annotation'
    this.motivation = motivation
    this.created = new Date().toISOString()
    this.target = {
      id: imgInfo['id'] || imgInfo['@id'],
      width: imgInfo.width,
      height: imgInfo.height,
      type: 'Image',
      format: 'image/jpeg'
    }
    if (creator) {
      this.addCreator(this.creator)
    }
    if (generator) {
      this.addGenerator(this.generator)
    }
  }

  /**
   * Set or update an item where more than one value is allowed.
   * @param {*} root
   *   The root attribute for which key should be set to value.
   * @param {String} key
   *   The attribute of root for which to add value.
   * @param {*} value
   *   The value to be set for key.
   */
  _setMultiItem(root, key, value) {
    if (typeof root[key] === 'undefined') {
      root[key] = value
    } else if (Array.isArray(root[key]) && root[key].indexOf(value) < 0) {
      root[key].push(value)
    } else {
      root[key] = [root[key], value]
    }
    this.modified = new Date().toISOString()
  }

  /**
   * Update modified, creator and generator.
   * @param {Object} opts
   *   The creator and generator.
   */
  modify ({ creator = null, generator = null }) {
    this.modified = new Date().toISOString()
    if (creator) {
      this.addCreator(this.creator)
    }
    if (generator) {
      this.addGenerator(this.generator)
    }
  }

  /**
   * Add a tag.
   * @param {String} tag
   *   A plain text value.
   * @param {Object} imgInfo
   *   The IIIF image info.
   * @param {*} fragmentURI
   *   The IIIF image region.
   */
  addTag (tag, imgInfo, fragmentURI = null) {
    if (fragmentURI) {
      this.target.selector = {
        type: 'FragmentSelector',
        value: fragmentURI,
        conformsTo: imgInfo.protocol
      }
    }

    this.addBody({
      type: 'TextualBody',
      purpose: 'tagging',
      value: tag
    })
  }

  /**
   * Add a description
   * @param {String} description
   *   A plain text value.
   * @param {*} fragmentURI
   *   The IIIF image region.
   */
  addDescription (description) {
    this.addBody({
      type: 'TextualBody',
      purpose: 'describing',
      value: description,
      format: 'text/plain'
    })
  }

  /**
   * Add a Body to the Annotation.
   * @param {Object} opts
   *   The Body to be added.
   */
  addBody(opts) {
    this._setMultiItem(this, 'body', opts)
  }

  /**
   * Add a creator to the Annotation.
   * @param {Object} opts
   *   The body to be added.
   */
  addCreator(opts) {
    this._setMultiItem(this, 'creator', opts)
  }

  /**
   * Add a generator to the Annotation.
   * @param {Object} opts
   *   The generator to be added.
   */
  addGenerator(opts) {
    this._setMultiItem(this, 'generator', opts)
  }

  /**
   * Return matching bodies filtered at root level by filters.
   * @param {*} filters 
   *   Array of key-value pairs on which to search.
   */
  searchBodies (filters) {
    if (Array.isArray(this.body)) {
      const filtered = this.body.filter(function(item) {
        for (let prop in filters) {
          if (item[prop] !== filters[prop]) {
            return false
          }
        }
        return true
      })
      const bodies = []
      for (let item of filtered) {
        const idx = this.body.indexOf(item)
        bodies.push(this.body[idx])
      }
      return bodies
    } else if (this.body !== undefined) {
      for (let prop in filters) {
        if (this.body[prop] !== filters[prop]) {
          return []
        }
      }
      return this.body
    }
  }
}

export default Annotation
