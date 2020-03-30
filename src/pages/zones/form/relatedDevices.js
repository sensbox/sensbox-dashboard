import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Table, Tag, Popconfirm, Icon } from 'antd'

const mapStateToProps = ({ resource }) => ({
  current: resource.current,
})

@connect(mapStateToProps)
@Form.create()
class RelatedDevices extends React.Component {
  state = {
    selectedRowKeys: [], // Check here to configure the default column
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
  }

  attachDevices = () => {
    const { zone, dispatch } = this.props

    const { objectId } = zone

    dispatch({
      type: 'resource/LINK_MODEL',
      payload: {
        className: 'Zone',
        objectId,
        relationType: { relationName: 'relatedDevices', relatedClass: 'Device' },
        data: ['sTy8umT5QX', '8QvC4qfeFo'],
        notify: true,
        callback: () => {
          this.setState({ selectedRowKeys: [] })
        },
      },
    })
  }

  removeSelected = () => {
    // ajax request after empty completing
    const { zone, dispatch } = this.props

    const { selectedRowKeys } = this.state
    const { objectId } = zone

    dispatch({
      type: 'resource/UNLINK_MODEL',
      payload: {
        className: 'Zone',
        objectId,
        relationName: 'relatedDevices',
        data: selectedRowKeys,
        notify: true,
        callback: () => {
          this.setState({ selectedRowKeys: [] })
        },
      },
    })
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys })
  }

  render() {
    const { devices, loading } = this.props

    const { selectedRowKeys } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const hasSelected = selectedRowKeys.length > 0

    return (
      <div className="col-lg-12">
        <div className="ant-row">
          <Popconfirm
            title="are you sure to remove the relationship of these devices？"
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            onConfirm={() => this.removeSelected()}
          >
            <Button type="primary" disabled={!hasSelected} loading={loading}>
              Remove
            </Button>
          </Popconfirm>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>

          <Button className="float-right mb-1" icon="plus" onClick={this.attachDevices}>
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
              dataSource={devices}
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
