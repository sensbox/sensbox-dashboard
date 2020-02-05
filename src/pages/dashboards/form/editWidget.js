import React from 'react'
import { Form, Row, Col, Input, Button, message, Tabs } from 'antd'
import SeriesConfiguration from './SeriesConfiguration'
import styles from './style.module.scss'

const { TabPane } = Tabs

const getFormField = (value, errors) => Form.createFormField({ value, errors: errors && errors })

const mapPropsToFields = ({ itemDef, errors }) => {
  const { title, series } = itemDef
  console.log('itemdef', itemDef)
  console.log('Errors', errors)
  return {
    title: getFormField(title, errors.title),
    series: getFormField(series || [{ id: 0 }], errors.series),
  }
}

const onFieldsChange = ({ onDefinitionChange, itemDef }, changedFields) => {
  console.log(changedFields)
  const values = {}
  const errors = {}

  Object.keys(changedFields).forEach(field => {
    errors[field] = changedFields[field].errors
    values[field] = changedFields[field].value
  })

  const newItemDef = Object.assign({}, itemDef, values)
  onDefinitionChange(newItemDef, errors)
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
    const { form, onCancel } = this.props
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
              {getFieldDecorator('series')(<SeriesConfiguration />)}
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of tab 3
            </TabPane>
          </Tabs>
        </Form>
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
          }}
        >
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
