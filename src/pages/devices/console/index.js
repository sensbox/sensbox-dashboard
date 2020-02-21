import React from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import moment from 'moment'
import { Redirect } from 'react-router-dom'
import { PageHeader, DatePicker, Icon, Dropdown, Menu, Table, Badge } from 'antd'
import { Line } from 'react-chartjs-2'

import deviceApi from 'services/device'
import sensorApi from 'services/sensor'
import cloudApi from 'services/cloud'

import './console.css'

const { RangePicker } = DatePicker

const mapStateToProps = ({ resource }) => ({
  current: resource.current,
  saving: resource.saving,
  objectNotFound: resource.objectNotFound,
})

@connect(mapStateToProps)
class DeviceConsole extends React.Component {
  state = {
    deviceMessagesSubscription: null,
    sensorsChangesSubscription: null,
    deviceMsgData: [],
    deviceSensorsData: [],
    chartsData: [],
    fromDate: moment().subtract(7, 'days'),
    toDate: moment(),
    timer: null,
    hasPendingOperations: false,
    selectedRefresh: 0,
    refreshMenuItems: [
      { key: 0, text: 'No Refresh' },
      { key: 5000, text: '5 seconds' },
      { key: 300000, text: '5 minutes' },
      { key: 1800000, text: '30 minutes' },
    ],
  }

  constructor(props) {
    super(props)
    const { dispatch, location } = props
    if (location.state) {
      dispatch({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Device',
          objectId: location.state.device.objectId,
        },
      })
    }
    this.onDatesChange = this.onDatesChange.bind(this)
    this.onDatesConfirm = this.onDatesConfirm.bind(this)
    this.handleRefreshMenuClick = this.handleRefreshMenuClick.bind(this)
  }

  async componentDidUpdate(prevProps) {
    const { current } = this.props
    if (current.objectId && current !== prevProps.current) {
      const deviceMessagesSubscription = await deviceApi.subscribeToMessages(current.uuid)
      const sensorsChangesSubscription = await sensorApi.subscribeToChanges(current.objectId)
      deviceMessagesSubscription.on('create', message => {
        const time = `${message.get('createdAt').toLocaleDateString()} ${message
          .get('createdAt')
          .toLocaleTimeString()}`
        const data = {
          // eslint-disable-next-line no-underscore-dangle
          objectId: message._getId(),
          time,
          topic: message.get('topic'),
          payload: JSON.stringify(message.get('payload')),
          protocol: message.get('protocol'),
        }
        this.setState(prevState => {
          const { deviceMsgData } = prevState
          deviceMsgData.unshift(data)
          return { deviceMsgData: deviceMsgData.slice(0, 10) }
        })
      })

      let { sensors } = current
      sensorsChangesSubscription.on('update', sensor => {
        // eslint-disable-next-line no-underscore-dangle
        sensors = sensors.map(s => (s.objectId === sensor._getId() ? sensor.toJSON() : s))
        this.setState({
          deviceSensorsData: sensors,
        })
      })
      sensorsChangesSubscription.on('create', sensor => {
        sensors.push(sensor.toJSON())
        this.setState({
          deviceSensorsData: sensors,
        })
      })
      sensorsChangesSubscription.on('delete', sensor => {
        // eslint-disable-next-line no-underscore-dangle
        sensors = sensors.filter(s => s.objectId !== sensor._getId())
        this.setState({
          deviceSensorsData: sensors,
        })
      })

      this.fetchDataFromCloud()

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        deviceMessagesSubscription,
        sensorsChangesSubscription,
        deviceSensorsData: sensors,
      })
    }
  }

  componentWillUnmount() {
    const { deviceMessagesSubscription, sensorsChangesSubscription, timer } = this.state
    if (deviceMessagesSubscription) deviceApi.unsubscribe(deviceMessagesSubscription)
    if (sensorsChangesSubscription) sensorApi.unsubscribe(sensorsChangesSubscription)
    if (timer) clearInterval(timer)
  }

  onDatesChange(data) {
    this.setState({
      fromDate: data[0],
      toDate: data[1],
    })
  }

  onDatesConfirm() {
    this.fetchDataFromCloud()
  }

  handleRefreshMenuClick({ key }) {
    const { timer } = this.state
    let interval = null
    clearInterval(timer)
    // console.log(key);
    if (Number(key) !== 0) {
      interval = setInterval(() => {
        this.setState({ toDate: moment() }, () => {
          const { hasPendingOperations } = this.state
          if (!hasPendingOperations) this.fetchDataFromCloud()
        })
      }, key)
    }
    this.setState({ selectedRefresh: Number(key), timer: interval })
  }

  fetchDataFromCloud() {
    this.setState({ hasPendingOperations: true }, async () => {
      const { current: device } = this.props
      const { fromDate, toDate } = this.state
      const data = await cloudApi.metricsStoreFetch(device, fromDate.toDate(), toDate.toDate())
      const chartsData = []
      data.forEach(item => {
        chartsData[item.name] = item.rows.map(r => ({ x: r.time, y: r.value }))
      })
      this.setState({ chartsData, hasPendingOperations: false })
    })
  }

  render() {
    const { location, history, current, objectNotFound } = this.props
    const {
      chartsData,
      deviceMsgData,
      deviceSensorsData,
      fromDate,
      toDate,
      timer,
      selectedRefresh,
      refreshMenuItems,
    } = this.state
    if (!location.state || objectNotFound) {
      return <Redirect to="/devices" />
    }

    const refreshMenu = (
      <Menu onClick={this.handleRefreshMenuClick}>
        {refreshMenuItems.map(i => (
          <Menu.Item key={i.key}>
            {/* <Icon type="user" /> */}
            {i.text}
          </Menu.Item>
        ))}
      </Menu>
    )

    const deviceMsgColumns = [
      {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        // width: 30,
      },
      {
        title: 'Topic',
        dataIndex: 'topic',
        key: 'topic',
        // width: 30,
        render: topic => <b>{topic}</b>,
      },
      {
        title: 'Payload',
        dataIndex: 'payload',
        key: 'payload',
        // width: 50,
      },
      {
        title: 'Protocol',
        dataIndex: 'protocol',
        key: 'protocol',
      },
    ]

    const deviceSensorsColumns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Status',
        dataIndex: 'connected',
        key: 'connected',
        render: connected =>
          connected ? (
            <Badge color="green" status="processing" text="Connected" />
          ) : (
            <Badge status="default" text="Disconnected" />
          ),
      },
      {
        title: 'Latest Value',
        dataIndex: 'latestValue',
        key: 'latestValue',
      },
    ]

    return (
      <div>
        <Helmet title="Device Console" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={() => history.goBack()}
          title="Device Console"
          subTitle={current.uuid}
          extra={[
            <RangePicker
              key={0}
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
              }}
              showTime
              format="YYYY/MM/DD HH:mm:ss"
              locale="es_ES"
              onChange={this.onDatesChange}
              onOk={this.onDatesConfirm}
              disabled={!!timer}
              value={[fromDate, toDate]}
            />,
            <Dropdown.Button key={1} overlay={refreshMenu} icon={<Icon type="sync" />}>
              {refreshMenuItems.find(m => m.key === selectedRefresh).text}
            </Dropdown.Button>,
          ]}
        />
        <div className="row">
          <div className="col-sm-12 col-md-6 col-lg-6">
            {deviceSensorsData.map(sensor => (
              <div key={sensor.objectId} className="card">
                <div className="card-header">
                  <div className="utils__title">
                    <strong>{sensor.name}</strong>
                  </div>
                </div>
                <div className="card-body">
                  <Line
                    height={100}
                    data={{
                      labels: '',
                      datasets: [
                        {
                          label: sensor.name,
                          data: chartsData[sensor.name] || [],
                          backgroundColor: '#eaeaea69',
                          borderColor: '#17a2b8',
                          borderWidth: 2,
                          spanGaps: true,
                          pointRadius: 0.5,
                          pointHoverRadius: 2,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      legend: {
                        display: false,
                        position: 'bottom',
                      },
                      scales: {
                        yAxes: [
                          {
                            ticks: {
                              min: sensor.inputMin,
                              max: sensor.inputMax,
                            },
                          },
                        ],
                        xAxes: [
                          {
                            type: 'time',
                            time: {
                              unit: 'day',
                            },
                          },
                        ],
                      },
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="col-sm-12 col-md-6 col-lg-6">
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Sensors status</strong>
                </div>
                <div className="utils__titleDescription">Status of devices sensors</div>
              </div>
              <div className="card-body">
                <Table
                  rowKey="objectId"
                  className="utils__scrollTable"
                  scroll={{ x: '100%' }}
                  columns={deviceSensorsColumns}
                  dataSource={deviceSensorsData}
                  pagination={false}
                  locale={{
                    emptyText: 'No sensors Registered',
                  }}
                />
              </div>
            </div>
            <div className="card">
              <div className="card-header">
                <div className="utils__title">
                  <strong>Messages</strong>
                </div>
                <div className="utils__titleDescription">Messages sent from device to server.</div>
              </div>
              <div className="card-body">
                <Table
                  rowKey="objectId"
                  scroll={{ x: true }}
                  columns={deviceMsgColumns}
                  dataSource={deviceMsgData}
                  pagination={false}
                  size="small"
                  locale={{
                    emptyText: 'No recently messages reported',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="card">
          <div className="card-body">
            <div className="row">
              asdf
            </div>
          </div>
        </div> */}
      </div>
    )
  }
}

export default DeviceConsole
