import { use } from 'react'
import useFetch from '@/hooks/useFetch';
import { Admin_Dashboard, Admin_Media_Edit, Admin_Media_Show } from '@/routes/Admin';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardHeader } from '@/components/ui/card';

const breadCrumbData = [
  {
    label: "Home",
    href: Admin_Dashboard
  },
  {
    label: "Media",
    href: Admin_Media_Show
  },
  {
    label: "Edit Media",
    href: ''
  }
]

const EditMedia = ({ params }) => {

  const { id } = use({ params });
  const { data: mediaData } = useFetch(`/api/media/get/${id}`)

  return (
    <div>
      <Breadcrumb data={breadCrumbData} />
      <Card className='p-0'>
        <CardHeader className='pb-4 border-b'>

        </CardHeader>
        <CardContent className="p-6">

        </CardContent>
      </Card>
    </div>
  )
}

export default EditMedia