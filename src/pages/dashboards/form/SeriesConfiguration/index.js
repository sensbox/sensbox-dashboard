import React from 'react'
import { Form, Input, Row, Col, Card, Button, Icon, Tooltip } from 'antd'
import shortid from 'shortid'
import styles from './style.module.scss'
import DeviceSelect from '../../../../components/Custom/DeviceSelect'
import SensorSelect from '../../../../components/Custom/SensorSelect'
import ColorPicker from '../../../../components/Custom/ColorPicker'

class SeriesConfiguration extends React.Component {
  // constructor(props) {
  //   super(props)
  //   console.log('instanciando', props.value)
  //   this.state = { series: props.value }
  // }

  // componentDidUpdate(prevProps) {
  //   const { value } = this.props
  //   if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
  //     this.setState({ series: value })
  //   }
  // }

  triggerOnChange = series => {
    const { onChange } = this.props
    onChange(series)
  }

  onSerieChange = (id, property, value) => {
    const { value: series } = this.props
    const updatedSeries = series.map(serie => {
      return serie.id === id ? { ...serie, [property]: value } : serie
    })
    this.triggerOnChange(updatedSeries)
  }

  onAddSerieClick = () => {
    const { value: series } = this.props
    const id = shortid.generate()
    // const newSerie = { id }
    // series.push(newSerie)
    this.triggerOnChange([...series, { id }])
  }

  onRemoveSerieClick = id => {
    const { value: series } = this.props
    this.triggerOnChange(series.filter(s => s.id !== id))
  }

  render() {
    const { value: series } = this.props
    // eslint-disable-next-line no-unused-vars
    const seriesElement = series.map(({ id, name, color, device, sensor }) => (
      <Card
        key={id}
        title={name || 'Serie'}
        hoverable
        size="small"
        className={styles.SerieCard}
        extra={
          <Tooltip title="Delete serie">
            <Button
              type="danger"
              icon="delete"
              size="small"
              onClick={() => this.onRemoveSerieClick(id)}
            />
          </Tooltip>
        }
      >
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item label="Name">
              <Input
                onChange={event => this.onSerieChange(id, 'name', event.target.value)}
                defaultValue={name}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Color">
              {/* <Input
                onChange={event => this.onSerieChange(id, 'color', event.target.value)}
                defaultValue={color}
              /> */}
              <ColorPicker
                onChange={newColor => this.onSerieChange(id, 'color', newColor.hex)}
                defaultValue={color}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[10, 10]}>
          <Col span={12}>
            <Form.Item
              label="Device"
              extra="Input device uuid or description to find one and select it."
            >
              <DeviceSelect
                onChange={devices => this.onSerieChange(id, 'device', devices)}
                defaultValue={device}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Sensor"
              extra="List of users that you want to share your dashboard. The users cannot modify the dashboard only visualize it."
            >
              {/* <Input
                onChange={event => this.onSerieChange(id, 'sensor', event.target.value)}
                defaultValue={sensor}
              /> */}
              <SensorSelect
                device={device ? device.objectId : undefined}
                onChange={sensors => this.onSerieChange(id, 'sensor', sensors)}
                defaultValue={sensor}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>
    ))

    return (
      <>
        {seriesElement}
        <Button type="default" className={styles.AddSerieButton} onClick={this.onAddSerieClick}>
          <Icon type="plus" /> Add new Serie
        </Button>
      </>
    )
  }
}

export default SeriesConfiguration
