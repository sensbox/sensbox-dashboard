import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd';

import { Helmet } from 'react-helmet'

import { Redirect } from "react-router-dom";
import CustomAvatar from 'components/Custom/Avatar';
import OrganizationForm  from "../form";

import style from './style.module.scss'


const mapStateToProps = ({ resource }) => ({
  current: resource.current,
  saving: resource.saving,
  objectNotFound: resource.objectNotFound,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class OrganizationEdit extends React.Component {
  state = {
    backLink: '/organizations',
  }

  constructor(props) {
    super(props);
    const { dispatch, location } = props;
    if (location.state) {
      dispatch({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Organization',
          objectId: location.state.organization.objectId
        }
      });
    }
    this.saveAction = this.saveAction.bind(this);
  }

  saveAction(formData) {
    const { current, dispatch } = this.props;
    console.log("GUARDANDO", formData);
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Organization',
        objectId: current.objectId,
        data: formData,
        notify: true
      }
    });
  }

  render() {
    const { saving, objectNotFound, location, history, current, formErrors } = this.props
    const { backLink } = this.state;
    const metadata = {
      createdBy: current.createdBy,
      updatedBy: current.updatedBy,
      createdAt: current.createdAt && new Date(current.createdAt).toLocaleString(),
      updatedAt: current.updatedAt && new Date(current.updatedAt).toLocaleString(),
    }

    if (!location.state || objectNotFound) {
      return <Redirect to={backLink} />
    }
    return (
      <div>
        <Helmet title="Organization Edit" />
        <PageHeader className="mb-2" onBack={() => history.replace({ pathname: backLink })} title="Organization Edit" subTitle={current.name} />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                { current &&
                  <OrganizationForm
                    organization={current}
                    disableSaveButton={saving}
                    saveAction={this.saveAction}
                    errors={formErrors}
                    backLink={backLink}
                  />
                }
              </div>
              <div className="col-lg-4">
                <h5 className="mb-3 text-black">
                  <strong>Metadata</strong>
                </h5>
                <dl className="row">
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Created by:</dt>
                  <dd className="col-xl-8">
                    <CustomAvatar user={metadata.createdBy} />
                  </dd>
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Updated by:</dt>
                  <dd className="col-xl-8">
                    <CustomAvatar user={metadata.updatedBy} />
                  </dd>
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Created:</dt>
                  <dd className="col-xl-8">{metadata.createdAt}</dd>
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Updated:</dt>
                  <dd className="col-xl-8">{metadata.updatedAt}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default OrganizationEdit;
