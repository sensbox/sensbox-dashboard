import React from 'react'
import { PageHeader, Button } from 'antd'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import GridLayout from '../../../components/Custom/GridLayout'

// import './styles.scss'

const mapStateToProps = ({ resource, user }) => ({
  list: resource.list,
  total: resource.total,
  loading: resource.loading,
  current: resource.current,
  user,
})

@connect(mapStateToProps)
class DashboardShow extends React.Component {
  state = {
    backLink: '/dashboards',
    layouts: [],
  }

  constructor(props) {
    super(props)
    const { dispatch, match } = props
    const { params } = match
    this.goToBuilder = this.goToBuilder.bind(this)
    // console.log(params.uuid);
    this.state = {
      ...this.state,
      builderLink: `/dashboards/builder/${params.uuid}`,
    }

    dispatch({
      type: 'resource/GET_CURRENT',
      payload: {
        className: 'Dashboard',
        where: {
          uuid: params.uuid,
        },
      },
    })
  }

  goToBuilder() {
    const { history } = this.props
    const { builderLink } = this.state
    history.push({
      pathname: builderLink,
    })
  }

  render() {
    const { history, current } = this.props
    const { backLink } = this.state
    return (
      <div>
        <Helmet title="My Dashboards" />
        <PageHeader
          onBack={() => history.replace({ pathname: backLink })}
          className="mb-2"
          ghost={false}
          title="Dashboard"
          subTitle="desc..."
          extra={[
            <Button
              key="button"
              type="dashed"
              icon="tool"
              onClick={this.goToBuilder}
              style={{ marginRight: 10, float: 'right' }}
            >
              Customize
            </Button>,
          ]}
        />
        <GridLayout
          layouts={current.layouts}
          widgets={current.widgets}
          onLayoutChange={this.saveLayout}
          isDraggable={false}
          isResizable={false}
          widgetsHoverable={false}
          widgetsEditable={false}
        />
      </div>
    )
  }
}

export default DashboardShow
