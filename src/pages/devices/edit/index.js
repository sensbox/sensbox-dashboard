import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd';

import { Helmet } from 'react-helmet'

import { Redirect } from "react-router-dom";
import CustomAvatar from 'components/Custom/Avatar';
import DeviceForm  from "../form";

import style from './style.module.scss'


const mapStateToProps = ({ resource }) => ({
  current: resource.current,
  saving: resource.saving,
  objectNotFound: resource.objectNotFound
})

@connect(mapStateToProps)
class DeviceSettings extends React.Component {

  constructor(props) {
    super(props);
    const { dispatch, location } = props;
    if (location.state) {
      dispatch({
        type: 'resource/GET_CURRENT',
        payload: {
          className: 'Device',
          objectId: location.state.device.objectId
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
        className: 'Device',
        objectId: current.objectId,
        data: formData,
        notify: true
      }
    });
  }

  render() {
    const { saving, objectNotFound, location, history, current } = this.props
    // console.log(history);
    const metadata = {
      createdBy: current.createdBy,
      updatedBy: current.updatedBy,
      createdAt: current.createdAt && new Date(current.createdAt).toLocaleString(),
      updatedAt: current.updatedAt && new Date(current.updatedAt).toLocaleString(),
    }

    if (!location.state || objectNotFound) {
      return <Redirect to="/devices" />
    }
    return (
      <div>
        <Helmet title="Device Settings" />
        <PageHeader className="mb-2" onBack={() => history.goBack()} title="Device Settings" subTitle={current.nombre} />
        <div className="card">
          {/* <div className="card-header">
            {/* 
            <div className="utils__title">
              <strong>Editar Centro</strong>
            </div> 
          </div> */}
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                { current &&
                  <DeviceForm
                    device={current}
                    disableSaveButton={saving}
                    saveAction={this.saveAction}
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

export default DeviceSettings;
