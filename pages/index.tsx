import AttributeForm from 'components/AttributeForm'

export default function DashboardPage() {
  return (
    <AttributeForm
      onSubmit={(_e, formData) => {
        console.log(formData)
      }}
    />
  )
}
