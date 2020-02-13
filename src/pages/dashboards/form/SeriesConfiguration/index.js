import React from 'react'
import { Form, Input, Row, Col, Card, Button, Icon, Tooltip } from 'antd'
import shortid from 'shortid'
import styles from './style.module.scss'
import DeviceSelect from '../../../../components/Custom/DeviceSelect'
import SensorSelect from '../../../../components/Custom/SensorSelect'
import ColorPicker from '../../../../components/Custom/ColorPicker'
import FunctionSelect from '../../../../components/Custom/FunctionSelect'

class SeriesConfiguration extends React.Component {
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
    const name = 'sensor'
    // const newSerie = { id }
    // series.push(newSerie)
    this.triggerOnChange([...series, { id, name }])
  }

  onRemoveSerieClick = id => {
    const { value: series } = this.props
    this.triggerOnChange(series.filter(s => s.id !== id))
  }

  render() {
    const { value: series } = this.props
    const seriesElement = series.map(({ id, name, color, devices, sensor, aggregation }) => (
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
                onChange={newDevices => this.onSerieChange(id, 'devices', newDevices)}
                defaultValue={devices}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Sensor"
              extra="List of users that you want to share your dashboard. The users cannot modify the dashboard only visualize it."
            >
              <SensorSelect
                devices={devices}
                onChange={sensors => this.onSerieChange(id, 'sensor', sensors)}
                defaultValue={sensor}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Aggregation"
              extra="List of users that you want to share your dashboard. The users cannot modify the dashboard only visualize it."
            >
              <FunctionSelect
                onChange={value => this.onSerieChange(id, 'aggregation', value)}
                defaultValue={aggregation}
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