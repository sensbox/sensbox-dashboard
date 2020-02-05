import React, { Component } from 'react'
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
// import htmlToDraft from 'html-to-draftjs';

const valueToEditorState = value => {
  let editorState
  try {
    if (value) {
      const blocksFromHTML = convertFromHTML(value)
      const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      )
      editorState = EditorState.createWithContent(state)
    } else {
      editorState = EditorState.createEmpty()
    }
  } catch (error) {
    editorState = EditorState.createEmpty()
  }

  return editorState
}

const editorStateToValue = editorState => {
  const currentContent = editorState.getCurrentContent()
  const rawContent = convertToRaw(currentContent)
  return draftToHtml(rawContent)
}

class TextEditor extends Component {
  constructor(props) {
    super(props)
    const { value } = props
    console.log(value)
    this.state = {
      editorState: valueToEditorState(value),
      // modified: false
    }
  }

  componentDidUpdate(prevProps) {
    // const { modified } = this.state;
    const { value } = this.props

    if (value !== prevProps.value) {
      // console.log("-prev",prevProps.value);
      // console.log("value",value);
      // console.log("modified",modified);
      // if (!modified) {
      // console.log("updating state");
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        editorState: valueToEditorState(value),
      })
      // }
    }
  }

  onEditorStateChange = editorState => {
    // const { onChange } = this.props;
    // const rawValue = editorStateToValue(editorState);
    this.setState({
      editorState,
      // modified: true,
    })
    // }, () => onChange(rawValue));
  }

  onBlur = (event, editorState) => {
    const { onChange } = this.props
    const rawValue = editorStateToValue(editorState)
    onChange(rawValue)
  }

  render() {
    const { editorState } = this.state
    return (
      <Editor
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        onBlur={this.onBlur}
      />
    )
  }
}

export default TextEditor
