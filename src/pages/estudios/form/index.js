import React from 'react'
import { Input, InputNumber, Select, Button, Form, message } from 'antd'
import { unescape } from "lodash";
import { Link } from "react-router-dom";

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

import ProvinciaService from 'services/provincia';
import LocalidadService from 'services/localidad';
import TextEditor from 'components/Custom/TextEditor';
import styles from './style.module.scss';

const FormItem = Form.Item;
const { Option } = Select;
// const { TextArea } = Input;



const findLocalidades = (provincia) => {
  return LocalidadService.find({
    where: { 
      'provincia.nombre': provincia
    },
    sortField: 'nombre',
    limit: 600,
  });
}

const getFormField = (value, errors) => Form.createFormField({ value, errors: errors && errors.map(e => new Error(e)) });

const mapPropsToFields = ({ centro, errors }) => {
  const { nombre, emailContacto, calle, numero, provincia, localidad, observaciones } = centro || {};

  return {
    nombre: getFormField(nombre, errors.nombre),
    emailContacto: getFormField(emailContacto, errors.emailContacto),
    calle: getFormField(calle, errors.calle),
    numero: getFormField(numero, errors.numero),
    provincia: getFormField(provincia, errors.provincia),
    localidad: getFormField(localidad, errors.localidad),
    observaciones: getFormField(unescape(observaciones, errors.observaciones))
  }
}

@Form.create({ mapPropsToFields })
class CentroForm extends React.Component {

  state = {
    provincias: [],
    localidades: [],
  }

  constructor(props) {
    super(props);
    const { centro } = props;
    if (centro) {
      this.initialize(centro);
    }
    this.onProvinciaChange = this.onProvinciaChange.bind(this);
    this.save = this.save.bind(this);
  }

  // eslint-disable-next-line react/sort-comp
  initialize(centro) {
    const { provincia } = centro;
    ProvinciaService.find().then((data) => this.setState({ provincias: data.results }));
    if (provincia) {
      findLocalidades(provincia).then((data) => this.setState({ localidades: data.results }));
    }
  }

  onProvinciaChange(provinciaId) {
    const { form } = this.props;
    const { provincias } = this.state;
    this.setState(
      { loadingLocalidades: true },
      async () => {
        const provincia = provincias.find((i) => i.objectId === provinciaId);
        findLocalidades(provincia.nombre).then((data) => {
          this.setState({ 
              localidades: data.results,
              loadingLocalidades: false,
          }, () => form.setFieldsValue({
              localidad: data.results[0].nombre,
          }));
        });
      }
    );
  }

  save() {
    const { form, saveAction } = this.props;
    const { provincias, localidades } = this.state;

    form.validateFields((err, values) => {
      if (!err) {
        const provincia = provincias.find((i) => i.objectId === values.provincia);
        const localidad = localidades.find((i) => i.objectId === values.localidad);

        let data = { ...values }
        if (provincia) data = { ...data, provincia: provincia.nombre } ;
        if (localidad) data = { ...data, localidad: localidad.nombre } ;

        saveAction(data);
        
        form.getFieldInstance('nombre').focus();
      } else {
        const firstFieldWithError = Object.keys(err).pop();
        form.getFieldInstance(firstFieldWithError).focus();
        message.error('Por favor revise todos los campos del formulario', 2.5)
      }
    });
  }

  render() {
    const {
      form,
      disableSaveButton,
    } = this.props

    const { provincias, localidades, loadingLocalidades } = this.state;
    
    return (
      <Form layout="vertical" autoComplete="off">
        <div className="col-lg-12">
          <h4 className="text-black mb-3">
            <strong>Institución</strong>
          </h4>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Nombre">
                  {form.getFieldDecorator('nombre',{
                    rules: [
                      { required: true, message: 'Por favor ingrese un nombre.', whitespace: true }
                    ],
                  })(<Input placeholder="Escriba el nombre de la institución" />)}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Email">
                  {form.getFieldDecorator('emailContacto',{
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
                  })(<Input placeholder="Escriba el e-mail de la institución" />)}
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <h4 className="text-black mt-2 mb-3">
            <strong>Dirección</strong>
          </h4>
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Calle">
                  {form.getFieldDecorator('calle')(
                    <Input placeholder="Escribe la dirección" />
                  )}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Número">
                  {form.getFieldDecorator('numero')(
                    <InputNumber
                      placeholder="Escriba el número de la dirección"
                      style={{ width: '100%'}}
                    />
                  )}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Provincia">
                  {form.getFieldDecorator('provincia')(
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Seleccione una Provincia"
                      optionFilterProp="children"
                      notFoundContent={null}
                      onChange={this.onProvinciaChange}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      { provincias.map((l) => 
                        <Option key={l.objectId}>{l.nombre}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <FormItem label="Localidad">
                  {form.getFieldDecorator('localidad')(
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="Seleccione una Localidad"
                      optionFilterProp="children"
                      loading={loadingLocalidades}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      { localidades.map((l) => 
                        <Option key={l.objectId}>{l.nombre}</Option>
                      )}
                    </Select>
                  )}
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <h4 className="text-black mt-2 mb-3">
            <strong>Observaciones</strong>
          </h4>
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <FormItem>
                  <div className={styles.editor}>
                    {form.getFieldDecorator('observaciones')(
                      <TextEditor />
                    )}
                  </div>
                </FormItem>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="form-actions">
            <Button icon="save" disabled={disableSaveButton} type="primary" className="mr-2" onClick={this.save}>
              Guardar
            </Button>
            <Link to="/centros">
              <Button icon="arrow-left" type="default">Volver</Button>
            </Link>
          </div>
        </div>
      </Form>
    )
  }
}

CentroForm.defaultProps = {
  centro: {},
  errors: {},
  saveAction: (formData) => console.log(formData)
};

export default CentroForm;
