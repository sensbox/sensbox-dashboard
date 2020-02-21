import React from 'react'
import { Form, Row, Col, Input, Button, message, Tabs } from 'antd'
import SeriesConfiguration from './SeriesConfiguration'
import styles from './style.module.scss'
import AxisConfiguration from './AxisConfiguration'

const { TabPane } = Tabs

const getFormField = (value, errors) => Form.createFormField({ value, errors: errors && errors })

const mapPropsToFields = ({ itemDef, errors }) => {
  const { title, series, axes } = itemDef
  return {
    title: getFormField(title, errors.title),
    series: getFormField(series, errors.series),
    axes: getFormField(axes, errors.axes),
  }
}

const onFieldsChange = ({ onDefinitionChange, itemDef }, changedFields) => {
  const values = {}
  const errors = {}

  const [field, properties] = Object.entries(changedFields)[0]
  const { value: fieldValue, errors: fieldErrors, touched, validating } = properties
  values[field] = fieldValue
  errors[field] = fieldErrors

  // if values and errors are modified
  if (touched && !validating) {
    const newItemDef = Object.assign({}, itemDef, values)
    onDefinitionChange(newItemDef, errors)
  }
}

@Form.create({ mapPropsToFields, onFieldsChange })
class EditWidgetForm extends React.Component {
  constructor(props) {
    super(props)
    this.save = this.save.bind(this)
  }

  save() {
    const { form, itemDef, onSubmit } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const newItemDef = Object.assign({}, itemDef, values)
        onSubmit(newItemDef)
        form.getFieldInstance('title').focus()
      } else {
        const firstFieldWithError = Object.keys(err).pop()
        form.getFieldInstance(firstFieldWithError).focus()
        message.error('Please check all form fields.', 2.5)
      }
    })
  }

  render() {
    const { form, onCancel, itemDef } = this.props
    const { getFieldDecorator } = form
    // console.log(form.getFieldsValue())

    return (
      <>
        <Form hideRequiredMark className={styles.editWidgetForm}>
          <Tabs tabPosition="top" defaultActiveKey="1" size="small">
            <TabPane tab="Graph Controls" key="1">
              <Row>
                <Col>
                  <Form.Item label="Title">
                    {getFieldDecorator('title', {
                      rules: [{ required: true, message: 'Please input the title of the widget!' }],
                    })(<Input placeholder="Please enter a title" />)}
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="Series" key="2">
              {getFieldDecorator('series')(<SeriesConfiguration axes={itemDef.axes} />)}
            </TabPane>
            <TabPane tab="Axis" key="3">
              {getFieldDecorator('axes')(<AxisConfiguration series={itemDef.series} />)}
            </TabPane>
          </Tabs>
        </Form>
        <div className={styles.Actions}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button onClick={this.save} type="primary">
            Submit
          </Button>
        </div>
      </>
    )
  }
}

export default EditWidgetForm
