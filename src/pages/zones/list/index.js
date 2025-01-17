import React from 'react'
import { PageHeader, Tooltip, Row, Switch, Col, Table, Button, Input, Modal } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import CustomDate from 'components/Custom/Date'
import api from 'services/api'

const { confirm } = Modal

const mapStateToProps = ({ resource }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
})

@connect(mapStateToProps)
class Zones extends React.Component {
  state = {
    searchField: 'name',
    searchText: '',
    sortField: 'id',
    sortOrder: 'ascend',
    currentPage: 0,
    limit: 10,
    backLink: '/organizations',
    addLink: null,
    editLink: null,
  }

  constructor(props) {
    super(props)
    const { location } = props
    if (location.state) {
      this.state = {
        ...this.state,
        organization: location.state.organization,
        addLink: `/organizations/${location.state.organization.objectId}/zones/new`,
        editLink: `/organizations/${location.state.organization.objectId}/zones/edit`,
      }
      this.dispatchGetData()
    }
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
    const { addLink, organization } = this.state
    history.push({
      pathname: addLink,
      state: { organization },
    })
  }

  onEdit = row => {
    // console.log(row, this.props);
    const { history } = this.props
    const { editLink } = this.state
    history.push({
      pathname: editLink,
      state: { zone: row },
    })
  }

  onRemove = row => {
    const { dispatch } = this.props
    let callback = () => {
      const { total, list } = this.props
      if (total !== 0 && list.length === 0) {
        this.setState(
          prevState => ({ currentPage: prevState.currentPage - 1 }),
          () => this.dispatchGetData(),
        )
      }
    }
    callback = callback.bind(this)

    confirm({
      title: 'Do you Want to delete the zone?',
      content: "If you delete this zone, all of the object's associated will be deleted.",
      okType: 'danger',
      onOk() {
        dispatch({
          type: 'resource/REMOVE',
          payload: {
            className: 'Zone',
            objectId: row.objectId,
            notify: true,
            callback,
          },
        })
      },
    })
  }

  onBack = () => {
    const { history } = this.props
    const { backLink, organization } = this.state
    return history.replace({
      pathname: backLink,
      state: { organization },
    })
  }

  updateActive(objectId, active) {
    const { dispatch } = this.props
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Zone',
        objectId,
        data: { active },
        notify: true,
        clearCurrent: true,
      },
    })
  }

  dispatchGetData() {
    const { dispatch } = this.props
    const {
      organization,
      searchField,
      searchText,
      currentPage,
      limit,
      sortField,
      sortOrder,
    } = this.state
    dispatch({
      type: 'resource/GET_DATA',
      payload: {
        className: 'Zone',
        where: {
          organization: api.createPointer('Organization', organization.objectId),
        },
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
    const { location, list, total, loading } = this.props
    const { backLink, organization, currentPage } = this.state
    // console.log(loading)
    const pagination = {
      current: currentPage,
      total,
    }
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        sorter: true,
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
            <Tooltip title="Edit Zone">
              <Button
                shape="circle"
                icon="edit"
                className="mr-1"
                onClick={() => this.onEdit(row)}
              />
            </Tooltip>
            <Tooltip title="Remove Zone">
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
    if (!location.state) {
      return <Redirect to={backLink} />
    }
    return (
      <div>
        <Helmet title="Zones" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={this.onBack}
          title="Manage Zones"
          subTitle={`in ${organization.name}`}
        />
        <div className="card">
          <div className="card-header">
            <Row>
              <Col sm={24} md={12} offset={12}>
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
                  New Zone
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

export default Zones
