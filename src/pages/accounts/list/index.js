import React from 'react'
import { Tooltip, Row, Switch, Col, Table, Button, Input, Modal } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import CustomDate from 'components/Custom/Date'

const { confirm } = Modal
const mapStateToProps = ({ resource }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
})

@connect(mapStateToProps)
class Account extends React.Component {
  state = {
    searchField: 'firstName',
    searchText: '',
    sortField: 'id',
    sortOrder: 'ascend',
    currentPage: 0,
    limit: 10,
  }

  constructor(props) {
    super(props)
    this.dispatchGetData()
    this.onAdd.bind(this)
  }

  handleTableChange = (pagination, filters, sorters) => {
    const { current } = pagination
    const { columnKey, order } = sorters
    const { sortField, sortOrder } = this.state
    this.setState(
      {
        currentPage: current,
        sortField: columnKey || sortField,
        sortOrder: order || sortOrder,
      },
      () => this.dispatchGetData(),
    )
  }

  onSearch = text => {
    this.setState({ searchText: text, currentPage: 1 }, () => this.dispatchGetData())
  }

  onAdd = () => {
    const { history } = this.props
    history.push({
      pathname: '/accounts/new',
    })
  }

  onEdit = row => {
    // console.log(row, this.props);
    const { history } = this.props
    history.push({
      pathname: `/accounts/edit`,
      state: { account: row },
    })
  }

  onRemove = row => {
    const { dispatch } = this.props
    confirm({
      title: 'Do you Want to delete the account?',
      content: "If you delete this account, all of the object's associated will be deleted.",
      okType: 'danger',
      onOk() {
        dispatch({
          type: 'resource/REMOVE',
          payload: {
            className: 'Account',
            objectId: row.objectId,
            notify: true,
          },
        })
      },
    })
  }

  // onManageZones = (row) => {
  //   const { history } = this.props;
  //   history.push({
  //     pathname: `/users/${row.objectId}/zones`,
  //     state: { organization: row }
  //   });
  // }

  updateActive(objectId, active) {
    const { dispatch } = this.props
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Account',
        objectId,
        data: { active },
        notify: true,
        clearCurrent: true,
      },
    })
  }

  dispatchGetData() {
    const { dispatch } = this.props
    const { searchField, searchText, currentPage, limit, sortField, sortOrder } = this.state

    dispatch({
      type: 'resource/GET_DATA',
      payload: {
        className: 'Account',
        includes: ['organization', 'user'],
        searchField,
        searchText,
        page: currentPage > 0 ? currentPage - 1 : 0,
        limit,
        sortField,
        sortOrder,
      },
    })
  }

  render() {
    const { list, total, loading } = this.props
    const { currentPage } = this.state
    // console.log(loading)
    const pagination = {
      current: currentPage,
      total,
    }
    const columns = [
      {
        title: 'Username',
        dataIndex: 'user.username',
        key: 'username',
        sorter: true,
      },
      {
        title: 'Full Name',
        key: 'fullName',
        sorter: false,
        render: row => <span>{`${row.lastName}, ${row.firstName} ${row.middleName || ''}`}</span>,
      },
      {
        title: 'Organization',
        key: 'organization',
        dataIndex: 'organization.name',
        sorter: false,
      },
      {
        title: 'Status',
        key: 'active',
        sorter: true,
        render: row => (
          <Tooltip title={row.active ? 'Enabled' : 'Disabled'}>
            <Switch
              size="small"
              checked={row.active}
              onChange={checked => this.updateActive(row.objectId, checked)}
            />
          </Tooltip>
        ),
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        sorter: true,
        render: createdAt => <CustomDate raw={createdAt} />,
      },
      {
        title: 'Last Modified',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: true,
        render: updatedAt => <CustomDate raw={updatedAt} />,
      },
      {
        title: 'Actions',
        key: 'action',
        render: row => (
          <>
            <Tooltip title="Edit Account">
              <Button
                shape="circle"
                icon="edit"
                className="mr-1"
                onClick={() => this.onEdit(row)}
              />
            </Tooltip>
            <Tooltip title="Remove Account">
              <Button
                shape="circle"
                type="danger"
                icon="delete"
                onClick={() => this.onRemove(row)}
              />
            </Tooltip>
          </>
        ),
      },
    ]

    return (
      <div>
        <Helmet title="Devices" />
        <div className="card">
          <div className="card-header">
            <Row>
              <Col sm={24} md={12}>
                <div className="utils__title">
                  <strong>Accounts</strong>
                </div>
                <div className="utils__titleDescription">List of accounts...</div>
              </Col>
              <Col sm={24} md={12}>
                <Input.Search
                  style={{ float: 'right', width: 300 }}
                  placeholder="Search by name"
                  onSearch={this.onSearch}
                  enterButton
                />
                <Button
                  type="primary"
                  icon="plus"
                  onClick={this.onAdd}
                  style={{ marginRight: 10, float: 'right' }}
                >
                  New Account
                </Button>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Table
              rowKey="objectId"
              className="utils__scrollTable"
              scroll={{ x: '100%' }}
              columns={columns}
              dataSource={list}
              onChange={this.handleTableChange}
              pagination={pagination}
              loading={loading}
              size="middle"
            />
          </div>
        </div>
      </div>
    )
  }
}

export default Account
