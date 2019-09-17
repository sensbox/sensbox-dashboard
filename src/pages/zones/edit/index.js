import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd';

import { Helmet } from 'react-helmet'

import { Redirect } from "react-router-dom";
import CustomAvatar from 'components/Custom/Avatar';
import ZoneForm  from "../form";

import style from './style.module.scss'


const mapStateToProps = ({ resource }) => ({
  current: resource.current,
  saving: resource.saving,
  objectNotFound: resource.objectNotFound,
  formErrors: resource.formErrors,
})

@connect(mapStateToProps)
class ZoneEdit extends React.Component {
  state = {
    backLink: '/organizations',
  }

  constructor(props) {
    super(props);
    const { dispatch, location } = props;
    if (location.state) {
      this.state = {
        ...this.state,
        backLink: `/organizations/${location.state.zone.organization.objectId}/zones`,
      }
      dispatch({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Zone',
          objectId: location.state.zone.objectId
        }
      });
    }
    this.saveAction = this.saveAction.bind(this);
  }

  onBack = () => {
    const { history, current} = this.props;
    const { backLink } = this.state;
    return history.replace({
      pathname: backLink,
      state: { organization: current.organization } 
    })
  };

  saveAction(formData) {
    const { current, dispatch } = this.props;
    console.log("GUARDANDO", formData);
    dispatch({
      type: 'resource/UPDATE',
      payload: {
        className: 'Zone',
        objectId: current.objectId,
        data: formData,
        notify: true
      }
    });
  }

  render() {
    const { saving, objectNotFound, location, current, formErrors } = this.props;
    const { backLink } = this.state;
    // console.log(history);
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
        <Helmet title="Zone Edit" />
        <PageHeader
          className="mb-2"
          onBack={this.onBack}
          title="Zone Edit"
          subTitle={current.name}
        />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                { current &&
                  <ZoneForm
                    zone={current}
                    disableSaveButton={saving}
                    saveAction={this.saveAction}
                    errors={formErrors}
                    backLink={{ pathname: backLink, state: { organization: current.organization }}}
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

export default ZoneEdit;
