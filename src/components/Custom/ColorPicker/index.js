import React from 'react'
import { TwitterPicker } from 'react-color'

class ColorPicker extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayColorPicker: false,
      color: props.defaultValue,
    }
  }

  handleClick = () => {
    const { displayColorPicker } = this.state
    this.setState({ displayColorPicker: !displayColorPicker })
  }

  handleClose = () => {
    this.setState({ displayColorPicker: false })
  }

  handleChange = color => {
    const { onChange } = this.props
    this.setState({ color: color.hex }, () => onChange(color))
  }

  render() {
    const { color, displayColorPicker } = this.state
    const styles = {
      color: {
        width: '30px',
        height: '20px',
        borderRadius: '2px',
        background: `${color}`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '4px',
        border: '1px solid #e4e9f0',
        // boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
        marginTop: 4,
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
    }

    return (
      <div>
        <span
          role="button"
          tabIndex="0"
          style={styles.swatch}
          onKeyPress={this.handleClick}
          onClick={this.handleClick}
        >
          <div style={styles.color} />
        </span>
        {displayColorPicker ? (
          <div style={styles.popover}>
            <div aria-hidden style={styles.cover} onClick={this.handleClose} />
            <TwitterPicker color={color} onChange={this.handleChange} />
          </div>
        ) : null}
      </div>
    )
  }
}

export default ColorPicker
