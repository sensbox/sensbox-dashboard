import React from 'react'
import { Modal, Input, InputNumber, Button, Form, message, Table } from 'antd'
import { Link } from "react-router-dom";
import CentrosService from 'services/centro';

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import styles from './style.module.scss';

const FormItem = Form.Item;

const loadCentros = () => {
  return CentrosService.find({
    sortField: 'nombre',
    limit: 400,
  });
}

const getFormField = (value, errors) => Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) });

const mapPropsToFields = ({ investigador, errors }) => {
  const { nombreCompleto, email, telefono, celular } = investigador || {};
  
  return {
    nombreCompleto: getFormField(nombreCompleto, errors.nombreCompleto),
    email: getFormField(email, errors.email),
    telefono: getFormField(telefono, errors.telefono),
    celular: getFormField(celular, errors.celular),
  }
}

@Form.create({ mapPropsToFields })
class InvestigadorForm extends React.Component {

  state = {
    centros: [],
    nuevosCentros: [],
    addCentroVisible: false,
  }

  constructor(props) {
    super(props);
    this.initialize();
    this.save = this.save.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  initialize() {
    loadCentros().then((data) => this.setState({ centros: data.results }));
  }

  save() {
    const { form, saveAction } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        saveAction(values);
        form.getFieldInstance('nombre').focus();
      } else {
        const firstFieldWithError = Object.keys(err).pop();
        form.getFieldInstance(firstFieldWithError).focus();
        message.error('Por favor revise todos los campos del formulario', 2.5)
      }
    });
  }

  toggleModal() {
    this.setState((state) => ({ addCentroVisible: !state.addCentroVisible }));
    // this.setState(({ nuevosCentros }) => ({
    //   nuevosCentros: [{ nombre:'asdf', telefono: 'asdf', email: 'adfasdf'}, ...nuevosCentros]
    // }));
  }

  centrosTable() {
    const { investigador } = this.props;
    const { nuevosCentros } = this.state;
    const { centros } = investigador;
    const dataSource = centros ? [ ...nuevosCentros, ...centros] : [];

    const columns = [
      {
        title: 'Nombre',
        dataIndex: 'nombre',
        key: 'nombre',
      },
      {
        title: 'Telefono contacto',
        dataIndex: 'telefono',
        key: 'telefono',
      },
      {
        title: 'Email contacto',
        dataIndex: 'email',
        key: 'email',
      },
    ];
    
    return <Table
      rowKey="objectId"
      size="small"
      pagination={{ pageSize: 5, hideOnSinglePage: true }}
      dataSource={dataSource}
      columns={columns}
    />;
  }

  render() {
    const {
      form,
      disableSaveButton,
    } = this.props;
    const { centros, addCentroVisible } = this.state;
    console.log(centros);
    return (
      <Form layout="vertical" autoComplete="off">
        <div className="col-lg-12">
          <h4 className="text-black mb-3">
            <strong>Información Personal</strong>
          </h4>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Nombre y Apellido">
                  {form.getFieldDecorator('nombreCompleto',{
                    rules: [
                      { required: true, message: 'Por favor ingrese un nombre.', whitespace: true }
                    ],
                  })(<Input placeholder="Escriba el nombre completo del Investigador" />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Email">
                  {form.getFieldDecorator('email',{
                    rules: [
                      {
                        type: 'email',
                        message: 'Escriba una dirección de E-mail válida.',
                      },
                      {
                        required: true,
                        message: 'Por favór ingrese un email.',
                      },
                    ],
                  })(<Input placeholder="Escriba el e-mail del investigador" />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Teléfono">
                  {form.getFieldDecorator('telefono')(
                    <InputNumber
                      placeholder="Escribe un número de télefono"
                      style={{ width: '100%'}}
                    />
                  )}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Celular">
                  {form.getFieldDecorator('celular')(
                    <InputNumber
                      placeholder="Escriba el número de celular"
                      style={{ width: '100%'}}
                    />
                  )}
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <h4 className="text-black mb-3">
            <strong>Centros de Investigación</strong>
          </h4>
          <div className="row">
            <div className="col-lg-12">
              <Button
                onClick={this.toggleModal}
                type="primary"
                size="small"
                style={{ marginBottom: 10 }}
              >
                Agregar un centro
              </Button>
              { this.centrosTable() }
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-actions">
            <Button icon="save" disabled={disableSaveButton} type="primary" className="mr-2" onClick={this.save}>
              Guardar
            </Button>
            <Link to="/investigadores">
              <Button icon="arrow-left" type="default">Volver</Button>
            </Link>
          </div>
        </div>
        <Modal
          title={`Vincule un centro para ${form.getFieldValue('nombreCompleto')}`}
          visible={addCentroVisible}
          // onOk={this.handleOk}
          onCancel={this.toggleModal}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </Form>
    )
  }
}

InvestigadorForm.defaultProps = {
  investigador: {},
  errors: {},
  saveAction: (formData) => console.log(formData)
};

export default InvestigadorForm;
