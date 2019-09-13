import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd';

import { Helmet } from 'react-helmet'

import { Redirect } from "react-router-dom";
import CustomAvatar from 'components/Custom/Avatar';
import CentroForm  from "../form";

import style from './style.module.scss'


const mapStateToProps = ({ centros }) => ({
  current: centros.current,
  saving: centros.saving,
  objectNotFound: centros.objectNotFound
})

@connect(mapStateToProps)
class CentroEdit extends React.Component {

  constructor(props) {
    super(props);
    const { dispatch, location } = props;
    if (location.state) {
      dispatch({
        type: 'centros/GET_CURRENT',
        payload: {
          objectId: location.state.centro.objectId
        }
      });
    }
    this.saveAction = this.saveAction.bind(this);
  }

  saveAction(formData) {
    // eslint-disable-next-line no-unused-vars
    const { current, dispatch } = this.props;
    console.log("GUARDANDO", formData);
    dispatch({
      type: 'centros/UPDATE',
      payload: {
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
      return <Redirect to="/centros" />
    }
    return (
      <div>
        <Helmet title="Centro Edit" />
        <PageHeader onBack={() => history.goBack()} title="Editar Centro" subTitle={current.nombre} />
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
                  <CentroForm
                    centro={current}
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
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Creado por:</dt>
                  <dd className="col-xl-8">
                    <CustomAvatar user={metadata.createdBy} />
                  </dd>
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Actualizado por:</dt>
                  <dd className="col-xl-8">
                    <CustomAvatar user={metadata.updatedBy} />
                  </dd>
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Creado:</dt>
                  <dd className="col-xl-8">{metadata.createdAt}</dd>
                  <dt className={`col-xl-4 ${style.metadataItem}`}>Actualizado:</dt>
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

export default CentroEdit;
