import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'
import { Helmet } from 'react-helmet'
import { Redirect } from 'react-router-dom'
import ZoneForm from '../form'
import api from '../../../services/api'

const mapStateToProps = ({ resource }) => ({
  saving: resource.saving,
  current: resource.current,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class ZoneNew extends React.Component {
  state = {
    organization: null,
    backLink: null,
    editLink: null,
  }

  constructor(props) {
    const { location } = props
    super(props)
    this.saveAction = this.saveAction.bind(this)
    if (location.state) {
      this.state = {
        ...this.state,
        organization: location.state.organization,
        backLink: `/organizations/${location.state.organization.objectId}/zones`,
        editLink: `/organizations/${location.state.organization.objectId}/zones/edit`,
      }
    } else {
      this.state = {
        ...this.state,
        backLink: `/organizations`,
      }
    }
  }

  componentDidUpdate() {
    const { current } = this.props
    const { editLink } = this.state
    console.log('CURRENT', current)
    if (current && current.objectId) {
      const { history } = this.props
      history.push({
        pathname: editLink,
        state: { zone: current },
      })
    }
  }

  onBack = () => {
    const { history } = this.props
    const { backLink, organization } = this.state
    return history.replace({
      pathname: backLink,
      state: { organization },
    })
  }

  saveAction(formData) {
    const { dispatch } = this.props
    const { organization } = this.state

    console.log('Saving', formData)
    dispatch({
      type: 'resource/CREATE',
      payload: {
        className: 'Zone',
        data: {
          organization: api.createPointer('Organization', organization.objectId),
          ...formData,
        },
        notify: true,
      },
    })
  }

  render() {
    const { location, saving, current, formErrors } = this.props
    const { backLink, organization } = this.state

    if (!location.state) {
      return <Redirect to={backLink} />
    }

    return (
      <div>
        <Helmet title="New Zone" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={this.onBack}
          title="New Zone"
          subTitle={`in ${organization.name}`}
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <ZoneForm
                  zone={current}
                  disableSaveButton={saving}
                  saveAction={this.saveAction}
                  errors={formErrors}
                  backLink={{ pathname: backLink, state: { organization } }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ZoneNew
