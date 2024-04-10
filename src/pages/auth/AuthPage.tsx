import { Form, Formik, FormikHelpers } from 'formik'
import { setFetch } from '../../utils/fetch'
import { getToastLoading, updateToastLoading } from '../../utils/toast'
import { FetchResponseWithData } from '../../Types/FetchResponse'
import * as Yup from 'yup'
import FormikInput from '../../component/formik/FormikInput'
import styles from './authPage.module.css'
import Button from '../../component/button/Button'
import LayoutToast from '../../layout/LayoutToast'

interface FormValues {
  credential: string
}

const AuthPage = () => {
  const initialValues: FormValues = {
    credential: ''
  }

  const validationSchema = Yup.object({
    credential: Yup.string().trim().strict().required()
  })

  const handleSubmit = async (values: FormValues, helper: FormikHelpers<FormValues>) => {
    const toastId = getToastLoading()

    try {
      const result = await setFetch(String(import.meta.env.VITE_AUTH_API), 'POST', values)
      
      if (result.status === 201) {
        const data: FetchResponseWithData<CredentialAuth> = await result.json()
        sessionStorage.setItem('token', data.data.token)
        updateToastLoading(toastId, 'success', data.msg)
        helper.resetForm()
        return
      }

      updateToastLoading(toastId, 'error', result.statusText)
    } catch (error) {
      updateToastLoading(toastId, 'error')
    }
  }

  return (
    <LayoutToast>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, helper) => handleSubmit(values, helper)}
        validationSchema={validationSchema}
      >
        {
          ({ errors }) => (
            <Form className={styles['form']} >
              <FormikInput 
                id='credentialId'
                labelTitle='Credential'
                name='credential'
                type='password'
                classNameField={styles['form-field']}
              />
              <p className={styles['field-error']}>
                {errors.credential}
              </p>

              <Button 
                aria-label='enviar formulario'
                className={styles['btn-submit']}
                type='submit'
              >
                Enviar
              </Button>
            </Form>
          )
        }
      </Formik>
    </LayoutToast>
  )
}

export default AuthPage