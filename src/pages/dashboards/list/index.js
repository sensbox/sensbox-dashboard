import React from 'react'
import { Button, Input, PageHeader, Row, Pagination, Col, message, Modal } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import DashboardCard from 'components/Custom/DashboardCard'
import DashboardForm from '../form/dashboard'
import ShareForm from '../form/share'
import './styles.scss'

const { confirm } = Modal

const mapStateToProps = ({ resource, user }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
  current: resource.current,
  user,
})

@connect(mapStateToProps)
class Dashboards extends React.Component {
  state = {
    searchField: 'name',
    searchText: '',
    sortField: 'id',
    sortOrder: 'ascend',
    currentPage: 0,
    limit: 12,
    dashboardModalVisible: false,
    shareModalVisible: false,
  }

  constructor(props) {
    super(props)
    this.dispatchGetData()
    this.addDashboard.bind(this)
    this.handlePaginationChange.bind(this)
    this.handleConfirmShareDashboard.bind(this)
  }

  handlePaginationChange = current => {
    this.setState(
      {
        currentPage: current,
      },
      () => this.dispatchGetData(),
    )
  }

  handleConfirmDashboard = objectId => {
    const { dispatch } = this.props
    const { form } = this.dashboardFormRef.props
    form.validateFields((err, values) => {
      if (!err) {
        const payload = {
          className: 'Dashboard',
          data: {
            ...values,
          },
          callback: () => {
            form.resetFields()
            this.setState({ dashboardModalVisible: false }, () => this.dispatchGetData())
          },
          notify: true,
        }
        dispatch({
          type: !objectId ? 'resource/CREATE' : 'resource/UPDATE',
          payload: !objectId ? payload : Object.assign({}, payload, { objectId }),
        })
      } else {
        const firstFieldWithError = Object.keys(err).pop()
        form.getFieldInstance(firstFieldWithError).focus()
        message.error('Please check all form fields.', 2.5)
      }
    })
  }

  handleCancelDashboard = () => {
    this.setState({
      dashboardModalVisible: false,
    })
  }

  handleCancelShareDashboard = () => {
    this.setState({
      shareModalVisible: false,
    })
  }

  handleConfirmShareDashboard = ({ objectId }, className, form) => {
    console.log(form)

    const { dispatch } = this.props
    form.validateFields((err, values) => {
      const permissions = {
        public: {
          read: values.public,
          write: false,
        },
      }
      permissions.users = values.users.map(u => ({ id: u.key, read: true, write: false }))

      const callback = () => {
        form.resetFields()
        this.setState({ shareModalVisible: false }, () => this.dispatchGetData())
      }

      if (!err) {
        dispatch({
          type: 'resource/SET_PERMISSIONS',
          payload: {
            className,
            objectId,
            permissions,
            notify: true,
            callback,
          },
        })
      } else {
        const firstFieldWithError = Object.keys(err).pop()
        form.getFieldInstance(firstFieldWithError).focus()
        message.error('Please check all form fields.', 2.5)
      }
    })
  }

  onSearch = text => {
    this.setState({ searchText: text, currentPage: 1 }, () => this.dispatchGetData())
  }

  saveDashboardFormRef = formRef => {
    this.dashboardFormRef = formRef
  }

  saveShareFormRef = formRef => {
    this.shareFormRef = formRef
  }

  addDashboard = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'resource/CLEAR_CURRENT',
      payload: {
        callback: () => this.setState({ dashboardModalVisible: true }),
      },
    })
  }

  editDashboard = dashboard => {
    this.fetchDashboard(dashboard.objectId, {
      callback: () => {
        this.setState({ dashboardModalVisible: true })
      },
    })
  }

  shareDashboard = dashboard => {
    this.fetchDashboard(dashboard.objectId, {
      requestObjectPermissions: true,
      callback: () => {
        this.setState({ shareModalVisible: true })
      },
    })
  }

  removeDashboard = dashboard => {
    const { dispatch } = this.props
    const callback = () => {
      const { total, list } = this.props
      if (total !== 0 && list.length === 0) {
        this.setState(
          prevState => ({ currentPage: prevState.currentPage - 1 }),
          () => this.dispatchGetData(),
        )
      }
    }

    confirm({
      title: 'Do you want to delete the dashboard?',
      content: 'If you delete this dashboard, all information will be dropped.',
      okType: 'danger',
      onOk() {
        dispatch({
          type: 'resource/REMOVE',
          payload: {
            className: 'Dashboard',
            objectId: dashboard.objectId,
            notify: true,
            callback,
          },
        })
      },
    })
  }

  fetchDashboard(dashboardId, opts) {
    const { dispatch } = this.props
    const { requestObjectPermissions = false, callback } = opts
    dispatch({
      type: 'resource/GET_CURRENT',
      payload: {
        className: 'Dashboard',
        objectId: dashboardId,
        requestObjectPermissions,
        callback,
      },
    })
  }

  dispatchGetData() {
    const { dispatch } = this.props
    const { searchField, searchText, currentPage, limit, sortField, sortOrder } = this.state

    dispatch({
      type: 'resource/GET_DATA',
      payload: {
        className: 'Dashboard',
        includes: ['createdBy', 'updatedBy'],
        searchField,
        searchText,
        page: currentPage > 0 ? currentPage - 1 : 0,
        limit,
        sortField,
        sortOrder,
      },
    })
  }

  goToDashboard(uuid) {
    const { history } = this.props
    history.push({
      pathname: `/dashboards/${uuid}`,
    })
  }

  render() {
    const { limit, dashboardModalVisible, shareModalVisible, currentPage } = this.state
    const { list, user, total } = this.props

    return (
      <div>
        <Helmet title="My Dashboards" />
        <PageHeader
          className="mb-2"
          ghost={false}
          title="My Dashboards"
          subTitle="Dashboards created or shared with you."
          extra={[
            <Input.Search
              key="search"
              style={{ float: 'right', width: 300 }}
              placeholder="Search by name"
              onSearch={this.onSearch}
              enterButton
              allowClear
            />,
            <Button
              key="button"
              type="primary"
              icon="plus"
              onClick={this.addDashboard}
              style={{ marginRight: 10, float: 'right' }}
            >
              New Dashboard
            </Button>,
          ]}
        />
        {
          <Row className="cardContainer" type="flex" justify="start" align="middle">
            {list.map(dashboard => (
              <Col key={dashboard.objectId} style={{ padding: 15 }} span={6}>
                <DashboardCard
                  title={dashboard.name}
                  description={dashboard.description}
                  public={dashboard.ACL['*'] ? dashboard.ACL['*'].read : false}
                  sharedBy={dashboard.createdBy.objectId === user.id ? null : dashboard.createdBy}
                  editAction={() => this.editDashboard(dashboard)}
                  removeAction={() => this.removeDashboard(dashboard)}
                  shareAction={() => this.shareDashboard(dashboard)}
                  onClick={() => this.goToDashboard(dashboard.uuid)}
                />
              </Col>
            ))}
          </Row>
        }
        {total > limit && (
          <Row type="flex" justify="center">
            <Pagination
              defaultCurrent={1}
              current={currentPage}
              total={total}
              onChange={this.handlePaginationChange}
              pageSize={limit}
            />
          </Row>
        )}
        <DashboardForm
          wrappedComponentRef={this.saveDashboardFormRef}
          visible={dashboardModalVisible}
          onCancel={this.handleCancelDashboard}
          onConfirm={this.handleConfirmDashboard}
        />
        <ShareForm
          wrappedComponentRef={this.saveShareFormRef}
          visible={shareModalVisible}
          onCancel={this.handleCancelShareDashboard}
          onConfirm={this.handleConfirmShareDashboard}
        />
      </div>
    )
  }
}

export default Dashboards
