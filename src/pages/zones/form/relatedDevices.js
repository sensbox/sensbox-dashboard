import React from 'react'
import { connect } from 'react-redux'
import { Button, Form, Table, Tag } from 'antd'
// import api from 'services/api'

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
    // this.dispatchGetData()
  }

  addRow = () => {}

  removeSelected = () => {
    // ajax request after empty completing
    const { zone } = this.props
    const { selectedRowKeys } = this.state

    const { objectId } = zone

    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
      })
    }, 1000)
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
          <Button
            type="primary"
            onClick={this.removeSelected}
            disabled={!hasSelected}
            loading={loading}
          >
            Remove
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>

          <Button className="float-right mb-1" icon="plus" onClick={this.addRow}>
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
