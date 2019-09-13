import React from 'react'
import { connect } from 'react-redux'
import { PageHeader } from 'antd';
import { Helmet } from 'react-helmet'

import InvestigadorForm  from "../form";


const mapStateToProps = ({ investigadores }) => ({
  saving: investigadores.saving,
  current: investigadores.current,
  formErrors: investigadores.formErrors,
})

@connect(mapStateToProps)
class InvestigadorNew extends React.Component {

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
        pathname: '/investigadores/edit',
        state: { investigador: current }
      });
    }
  }

  saveAction(formData) {
    // eslint-disable-next-line no-unused-vars
    const { dispatch } = this.props;
    console.log("GUARDANDO", formData);
    dispatch({
      type: 'investigadores/CREATE',
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
        <Helmet title="Nuevo Investigador" />
        <PageHeader onBack={() => history.goBack()} title="Nuevo Investigador" />
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-8">
                <InvestigadorForm
                  investigador={current}
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

export default InvestigadorNew;
