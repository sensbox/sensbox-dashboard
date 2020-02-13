import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd'
import { Helmet } from 'react-helmet'

import OrganizationForm from '../form'

const mapStateToProps = ({ resource }) => ({
  saving: resource.saving,
  current: resource.current,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class OrganizationNew extends React.Component {
  state = {
    backLink: '/organizations',
    editLink: '/organizations/edit',
  }

  constructor(props) {
    super(props)
    this.saveAction = this.saveAction.bind(this)
  }

  componentDidUpdate() {
    const { current } = this.props
    const { editLink } = this.state
    if (current && current.objectId) {
      const { history } = this.props
      history.push({
        pathname: editLink,
        state: { organization: current },
      })
    }
  }

  saveAction(formData) {
    // eslint-disable-next-line no-unused-vars
    const { dispatch } = this.props
    console.log('Saving', formData)
    dispatch({
      type: 'resource/CREATE',
      payload: {
        className: 'Organization',
        data: formData,
        notify: true,
      },
    })
  }

  render() {
    const { saving, current, formErrors, history } = this.props
    const { backLink } = this.state
    return (
      <div>
        <Helmet title="New Organization" />
        <PageHeader
          className="mb-2"
          ghost={false}
          onBack={() => history.replace({ pathname: backLink })}
          title="New Organization"
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <OrganizationForm
                  organization={current}
                  disableSaveButton={saving}
                  saveAction={this.saveAction}
                  errors={formErrors}
                  backLink={backLink}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OrganizationNew
