import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd';
import { Helmet } from 'react-helmet'

import CentroForm  from "../form";


const mapStateToProps = ({ centros }) => ({
  saving: centros.saving,
  current: centros.current,
  formErrors: centros.formErrors,
})

@connect(mapStateToProps)
class CentroNew extends React.Component {

  constructor(props) {
    super(props);
    this.saveAction = this.saveAction.bind(this);
  }

  componentDidUpdate() {
    const { current } = this.props;
    console.log("CURRENT", current);
    if( current && current.objectId ){
      const { history } = this.props;
      history.push({
        pathname: '/centros/edit',
        state: { centro: current }
      });
    }
  }

  saveAction(formData) {
    // eslint-disable-next-line no-unused-vars
    const { current, dispatch } = this.props;
    console.log("GUARDANDO", formData);
    dispatch({
      type: 'centros/CREATE',
      payload: {
        data: formData,
        notify: true
      }
    });
  }

  render() {
    const { saving, current, formErrors, history} = this.props
    
    return (
      <div>
        <Helmet title="Centro New" />
        <PageHeader onBack={() => history.goBack()} title="Nuevo Centro" />
        <div className="card">
          {/* <div className="card-header">
            <div className="utils__title">
              <strong>Crear Centro</strong>
            </div>
          </div> */}
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <CentroForm
                  centro={current}
                  disableSaveButton={saving}
                  saveAction={this.saveAction}
                  errors={formErrors}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default CentroNew;
