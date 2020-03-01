import React from 'react'
import shortid from 'shortid'
import { Card, Tooltip, Button, Row, Col, Form, Select, Icon, InputNumber, Input, Tag } from 'antd'
import styles from './style.module.scss'

const { Option } = Select

class AxisConfiguration extends React.Component {
  triggerOnChange = series => {
    const { onChange } = this.props
    onChange(series)
  }

  onAxisChange = (id, property, value) => {
    const { value: axes } = this.props
    const updatedAxes = axes.map(axis => {
      return axis.id === id ? { ...axis, [property]: value } : axis
    })
    this.triggerOnChange(updatedAxes)
  }

  onAddAxisClick = () => {
    const { value: axes } = this.props
    const id = shortid.generate()
    const axisIndex = axes.length + 1
    const label = `y axis ${axisIndex}`
    const position = 'left'
    this.triggerOnChange([...axes, { id, label, position }])
  }

  onRemoveAxisClick = id => {
    const { value: axes } = this.props
    this.triggerOnChange(axes.filter(a => a.id !== id))
  }

  render() {
    const { value: axes, series } = this.props

    const AxesElement = axes.map(({ id, position, min, max, label }, i) => {
      const seriesWithAxis = series.filter(s => s.axisId === id)
      return (
        <Card
          key={id}
          title={
            <>
              {(i && `Axis ${i + 1}`) || 'Default'}{' '}
              {seriesWithAxis.map(s => (
                <Tag key={s.id} color="cyan">
                  {s.name}
                </Tag>
              ))}
            </>
          }
          hoverable
          size="small"
          className={styles.AxisCard}
          extra={
            i > 0 &&
            seriesWithAxis.length === 0 && (
              <Tooltip title="Delete Axis">
                <Button
                  type="danger"
                  icon="delete"
                  size="small"
                  onClick={() => this.onRemoveAxisClick(id)}
                />
              </Tooltip>
            )
          }
        >
          <Row gutter={[10, 10]}>
            <Col span={4}>
              <Form.Item label="Label">
                <Input
                  onChange={event => this.onAxisChange(id, 'label', event.target.value)}
                  defaultValue={label}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Position">
                <Select
                  onChange={value => this.onAxisChange(id, 'position', value)}
                  defaultValue={position}
                >
                  <Option value="top">Top</Option>
                  <Option value="bottom">Bottom</Option>
                  <Option value="left">Left</Option>
                  <Option value="right">Right</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Min">
                <InputNumber
                  onChange={value => this.onAxisChange(id, 'min', value)}
                  defaultValue={min}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Max">
                <InputNumber
                  onChange={value => this.onAxisChange(id, 'max', value)}
                  defaultValue={max}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      )
    })

    return (
      <>
        {AxesElement}
        <Button type="default" className={styles.AddAxisButton} onClick={this.onAddAxisClick}>
          <Icon type="plus" /> Add new Axis
        </Button>
      </>
    )
  }
}

export default AxisConfiguration
