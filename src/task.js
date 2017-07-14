import Annotation from '@/annotation'

/**
 * Represents a task to be updated with user input as annotations.
 */
class Task {

  constructor ({
    id,
    tileSource,
    manifest = '',
    objective = '',
    guidance = '',
    tag = '',
    form = { model: {}, schema: {}, errors: [] },
    regions = [],
    annotations = []
  }) {
    this.id = id
    this.tileSource = tileSource
    this.manifest = manifest
    this.objective = objective
    this.guidance = guidance
    this.tag = tag
    this.form = form
    this.regions = regions
    this.annotations = annotations
  }

  /**
   * Return annotations by motivation.
   * @param {String} motivation
   *   The motivation.
   */
  getAnnotationsByMotivation (motivation) {
    const filteredAnnos = this.annotations.filter(function(anno) {
      return anno.motivation = motivation
    })

    const annoList = []
    for (let filteredAnno of filteredAnnos) {
      const idx = this.annotations.indexOf(filteredAnno)
      const originalAnno = this.annotations[idx]
      annoList.push(originalAnno)
    }
    return annoList
  }

  /**
   * Add a comment.
   * @param {String} text
   *   The comment value.
   */
  _addComment (text) {
    let anno = new Annotation('commenting', this.tileSource)
    anno.addBody({
      type: 'TextualBody',
      value: text,
      purpose: 'commenting',
      format: 'text/plain'
    })
    this.annotations.push(anno)
  }

  /**
   * Update the comment (assumes one per image).
   * @param {String} text
   *   The comment value.
   */
  updateComment (text) {
    let annos = this.getAnnotationsByMotivation('commenting')
    if (annos.length) {
      annos[0].modified = new Date().toISOString()
      annos[0].body.value = text
      return
    }
    this._addComment(text)
  }

  /**
   * Add a tag.
   * @param {String} value
   *   Plain text value for the tag.
   * @param {String} fragmentURI
   *   The IIIF image region.
   */
  tag (value, fragmentURI = null) {
    const anno = new Annotation('tagging', this.tileSource)
    anno.addTag(tag, fragmentURI = null)
    this.annotations.push(anno)
    return anno
  }

  /**
   * Add a description
   * @param {String} value
   *   Plain text value for the description.
   * @param {String} tag
   *   Plain text value for the tag.
   * @param {String} fragmentURI
   *   The IIIF image region.
   */
  describe (value, tag, fragmentURI = null) {
    const anno = new Annotation('describing', this.tileSource)
    anno.addDescription(value)
    anno.addTag(tag, fragmentURI = null)
    this.annotations.push(anno)
    return anno
  }

  /**
   * Delete an Annotation by ID.
   * @param {String} id
   *   The ID of the Annotation to delete.
   */
  deleteAnnotation (id) {
    const filteredAnnos = this.annotations.filter(function(anno) {
      return anno.id !== id
    })
    if (filteredAnnos.length === this.annotations.length) {
      throw Error('No Annotation exists with that ID')
    }
    this.annotations = filteredAnnos
  }
}

export default Task
