import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Table, Tag, Popconfirm, Icon, Modal } from 'antd'
import DeviceSelect from 'components/Custom/DeviceSelect'

const mapStateToProps = ({ resource }) => ({
  current: resource.current,
})

@connect(mapStateToProps)
@Form.create()
class RelatedDevices extends React.Component {
  state = {
    rowsToRemove: [], // Check here to configure the default column
    showModal: false,
    devices: [],
  }

  constructor(props) {
    super(props)

    this.columns = [
      {
        title: 'UUID',
        dataIndex: 'uuid',
        key: 'uuid',
        sorter: true,
        //  width: 350,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        sorter: true,
        //  width: 350,
      },
      {
        title: 'Status',
        key: 'connected',
        sorter: true,
        render: row => (
          <Tag color={row.connected ? 'green' : 'red'}>
            {row.connected ? 'Connected' : 'Disconnected'}
          </Tag>
        ),
        //  width: 150,
      },
    ]

    const { devices } = props
    this.state.devices = devices
  }

  dispatchAttachDevices = () => {
    const { devices } = this.state
    const { zone, dispatch } = this.props

    const { objectId } = zone

    const devicesIds = devices.map(el => el.objectId)

    dispatch({
      type: 'resource/PUT_RELATION',
      payload: {
        className: 'Zone',
        objectId,
        relationType: { relationName: 'relatedDevices', relatedClass: 'Device' },
        data: devicesIds,
        notify: true,
        callback: () => {
          this.setState({ devices: [] })
          this.showModal(false)
        },
      },
    })
  }

  dispatchRemoveSelected = () => {
    const { zone, dispatch } = this.props

    const { rowsToRemove } = this.state
    const { objectId } = zone

    dispatch({
      type: 'resource/UNLINK_MODEL',
      payload: {
        className: 'Zone',
        objectId,
        relationName: 'relatedDevices',
        data: rowsToRemove,
        notify: true,
        callback: () => {
          this.setState({ rowsToRemove: [] })
        },
      },
    })
  }

  showModal = showModal => {
    const { devices } = this.props
    this.setState({ showModal, devices })
  }

  onTableSelectChange = rowsToRemove => {
    this.setState({ rowsToRemove })
  }

  onModalSelectChange = selectedObjects => {
    this.setState({ devices: selectedObjects })
  }

  render() {
    const { devices: originalDevices } = this.props
    const { devices, loading } = this.state

    const { rowsToRemove, showModal } = this.state

    const rowSelection = {
      rowsToRemove,
      onChange: this.onTableSelectChange,
    }

    const hasSelected = rowsToRemove.length > 0

    return (
      <div className="col-lg-12">
        <Modal
          title="Manage Devices"
          visible={showModal}
          onCancel={() => this.showModal(false)}
          onOk={() => {
            this.dispatchAttachDevices()
          }}
        >
          <Form.Item
            label="Related Devices"
            extra="Input device uuid or description to find one and select it."
          >
            <DeviceSelect
              onChange={newDevices => this.onModalSelectChange(newDevices)}
              defaultValue={devices}
            />
          </Form.Item>
        </Modal>
        <div className="ant-row">
          <Popconfirm
            title="Are you sure unrelate these devices？"
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            onConfirm={() => this.dispatchRemoveSelected()}
          >
            <Button type="primary" disabled={!hasSelected} loading={loading}>
              Remove
            </Button>
          </Popconfirm>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${rowsToRemove.length} items` : ''}
          </span>

          <Button className="float-right mb-1" icon="plus" onClick={() => this.showModal(true)}>
            Attach Device...
          </Button>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Table
              rowKey="objectId"
              // size="small"
              rowSelection={rowSelection}
              className="utils__scrollTable"
              scroll={{ x: '100%' }}
              bordered
              dataSource={originalDevices}
              loading={loading}
              columns={this.columns}
              rowClassName="editable-row"
              // pagination={pagination}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default RelatedDevices
