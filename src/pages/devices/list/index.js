import React from 'react'
import { Tag, Tooltip, Row, Switch, Col, Table, Button, Input, Modal, Typography } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import CustomDate from '../../../components/Custom/Date'

import 'antd/es/statistic/style';

const { Password } = Input;
const InputGroup = Input.Group;
const { Paragraph } = Typography;

const mapStateToProps = ({ resource, devices }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
  isFetchingDeviceKey: devices.isFetching,
  deviceKey: devices.deviceKey
});

@connect(mapStateToProps)
class Devices extends React.Component {
  state = {
    searchField: 'uuid',
    searchText: '',
    sortField: 'id',
    sortOrder: 'ascend',
    currentPage: 0,
    limit: 10,
    visibleModal: false,
    device: {},
    password: ''
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
      pathname: '/devices/new',
    })
  }

  onEdit = row => {
    // console.log(row, this.props);
    const { history } = this.props
    history.push({
      pathname: `/devices/settings/${row.uuid}`,
      state: { device: row },
    })
  }

  // eslint-disable-next-line no-unused-vars
  onConsole = row => {
    const { history } = this.props
    history.push({
      pathname: '/devices/console',
      state: { device: row },
    })
  }

  // eslint-disable-next-line no-unused-vars
  onRemove = row => {
    // console.log(row, this.props);
  }

  onShowModal = (device) => {
    this.setState({
      visibleModal: true,
      device
    });
  };

  onHideModal = () => {
    const { dispatch } = this.props;
    this.setState({
      visibleModal: false,
      device: {},
      password: '',
    });

    dispatch({
        type: 'device/CLEAR_KEY',
        payload: {}
      });
  }

  updateActive = (objectId, active) => {
    const { dispatch } = this.props
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Device',
        objectId,
        data: { active },
        notify: true,
        clearCurrent: true,
      },
    })
  }

  dispatchSearchKey = () => {
    const { password, device } = this.state;
    const { dispatch } = this.props;
    const query = {
      password,
      uuid: device.uuid
    };

    dispatch({
      type: 'device/FETCH_KEY',
      payload: query
    })
  };

  dispatchGetData() {
    const { dispatch } = this.props
    const { searchField, searchText, currentPage, limit, sortField, sortOrder } = this.state

    dispatch({
      type: 'resource/GET_DATA',
      payload: {
        className: 'Device',
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
    const { list, total, loading, isFetchingDeviceKey, deviceKey } = this.props
    const { currentPage, visibleModal, password, device } = this.state
    // console.log(loading)
    const pagination = {
      current: currentPage,
      total,
    }
    const columns = [
      {
        title: 'UUID',
        dataIndex: 'uuid',
        key: 'uuid',
        sorter: true,
        width: 350,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        sorter: true,
        width: 350,
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
        width: 150,
      },
      {
        title: 'Active',
        key: 'active',
        sorter: true,
        render: row => (
          <Tooltip title={row.active ? 'Activado' : 'Desactivado'}>
            <Switch
              size="small"
              checked={row.active}
              onChange={checked => this.updateActive(row.objectId, checked)}
            />
          </Tooltip>
        ),
        width: 100,
      },
      {
        title: 'Last Modified',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        sorter: true,
        render: updatedAt => <CustomDate raw={updatedAt} />,
        width: 150,
      },
      {
        title: 'Action',
        key: 'action',
        render: row => (
          <>
            <Tooltip title="Device Settings">
              <Button
                shape="circle"
                icon="setting"
                className="mr-1"
                onClick={() => this.onEdit(row)}
              />
            </Tooltip>
            <Tooltip title="Device Console">
              <Button
                shape="circle"
                icon="desktop"
                className="mr-1"
                onClick={() => this.onConsole(row)}
              />
            </Tooltip>
            <Tooltip title="Copy Device Key">
              <Button
                shape="circle"
                icon="key"
                type=""
                onClick={() => this.onShowModal(row)}
              />
            </Tooltip>
            <Tooltip title="Remove Device">
              <Button
                shape="circle"
                type="danger"
                icon="delete"
                onClick={() => this.onRemove(row)}
              />
            </Tooltip>
          </>
        ),
        width: 150,
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
                  <strong>Devices</strong>
                </div>
                <div className="utils__titleDescription">Devices created or shared with you.</div>
              </Col>
              <Col sm={24} md={12}>
                <Input.Search
                  style={{ float: 'right', width: 300 }}
                  placeholder="Search by uuid"
                  onSearch={this.onSearch}
                  enterButton
                />
                <Button
                  type="primary"
                  icon="plus"
                  onClick={this.onAdd}
                  style={{ marginRight: 10, float: 'right' }}
                >
                  New Device
                </Button>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Modal
              title={`Copy Device Key from: ${device.uuid}`}
              visible={visibleModal}
              onCancel={this.onHideModal}
              footer={null}
            >
              <div className="ant-statistic mb-2">
                <div className="ant-statistic-title">Device Key</div>
                <div className="ant-statistic-content">
                  <Paragraph className="ant-statistic-content-value" copyable={deviceKey}>{deviceKey || '-'}</Paragraph>
                </div>
              </div>

              <InputGroup compact>
                <Password
                  value={password}
                  placeholder="Enter your password..."
                  allowClear
                  onChange={(el) => { this.setState({ password: el.target.value }) }}
                  style={{ width: '90%' }}
                  onPressEnter={this.dispatchSearchKey}
                />
                <Tooltip title="Search device key">
                  <Button
                    type="primary"
                    icon="search"
                    style={{ width: '10%' }}
                    loading={isFetchingDeviceKey}
                    onClick={this.dispatchSearchKey}
                  />
                </Tooltip>
              </InputGroup>
            </Modal>

            <Table
              rowKey="objectId"
              // className="utils__scrollTable"
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

export default Devices
