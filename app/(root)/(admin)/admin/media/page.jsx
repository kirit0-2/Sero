"use client"
import React, { useEffect } from 'react'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import { Admin_Dashboard, Admin_Media_Show } from '@/routes/Admin'
import UploadMedia from '@/components/Application/Admin/UploadMedia'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import axios from 'axios'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Media from '@/components/Application/Admin/Media'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import useDeleteMutation from '@/hooks/useDeleteMutaion'
import { useQueryClient } from '@tanstack/react-query'

const BreadCrumbData = [
  { label: "Home", href: Admin_Dashboard, },
  { label: "Media", href: "", },
]

const MediaPage = () => {
  const queryClient = useQueryClient()
  const [deleteType, setDeleteType] = useState("SD")
  const [selectMedia, setSelectedMedia] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  const searchParams = useSearchParams()

  useEffect(() => {
    const trashof = searchParams.get('trashof')
    setSelectedMedia([])
    if (trashof) {
      setDeleteType('PD')
    } else {
      setDeleteType('SD')
    }
  }, [searchParams])
  const fetchMedia = async (page, deleteType) => {
    const { data: response } = await axios.get(`/api/media?page=${page}&limit=10&deleteType=${deleteType}`)
    return response
  }
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['media-data', deleteType],
    queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length
      return lastPage.hasMore ? nextPage : undefined
    }
  })

  const deleteMutaion = useDeleteMutation('media-data', '/api/media/delete')
  const restoreMutation = useDeleteMutation('media-data', '/api/media/restore')

  const handleDelete = (ids, type) => {
    const idsToDelete = Array.isArray(ids) ? ids : [ids]
    const typeToDelete = type || deleteType

    if (confirm('Are you sure you want to delete these media?')) {
      deleteMutaion.mutate(
        { ids: idsToDelete, deleteType: typeToDelete },
        {
          onSuccess: () => {
            setSelectedMedia([])
            setSelectAll(false)
          }
        }
      )
    }
  }

  const handleRestore = (ids) => {
    const idsToRestore = Array.isArray(ids) ? ids : [ids]

    if (confirm('Are you sure you want to restore these media?')) {
      restoreMutation.mutate(
        { ids: idsToRestore, deleteType: 'RESTORE' }, // 'RESTORE' ensures PUT method in reuse hook
        {
          onSuccess: () => {
            setSelectedMedia([])
            setSelectAll(false)
          }
        }
      )
    }
  }

  const handleSelectAll = (checked) => {
    setSelectAll(checked)
    if (checked && data?.pages) {
      const allIds = data.pages.flatMap(page => page.mediaData.map(m => m._id))
      setSelectedMedia(allIds)
    } else {
      setSelectedMedia([])
    }
  }

  // Sync selectAll state if manual selection changes
  useEffect(() => {
    if (selectMedia.length === 0) setSelectAll(false)
  }, [selectMedia])

  return (
    <>
      <div>
        <BreadCrumb data={BreadCrumbData} />
        <Card className='p-0'>
          <CardHeader className='pb-4 border-b'>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className='font-bold text-2xl tracking-tight'>{deleteType === 'SD' ? 'Media' : 'Trash'}</h4>
                <p className='text-sm text-muted-foreground'>Manage your images and assets.</p>
              </div>
              <div className='flex items-center gap-3'>
                {deleteType === 'SD' && <UploadMedia isMultiple={true} queryClient={queryClient} />}
                <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
                  <button
                    onClick={() => setDeleteType("SD")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${deleteType === "SD" ? "bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setDeleteType("PD")}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${deleteType === "PD" ? "bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white" : "text-gray-500 hover:text-black dark:hover:text-white"}`}
                  >
                    Trash
                  </button>
                </div>
                <div className='flex gap-3'>
                  {
                    deleteType === "SD" ?
                      <Button type="button" variant="destructive">
                        <Link href={`${Admin_Media_Show}?trashof=media`}>Trash</Link>
                      </Button>
                      :
                      <Button type="button">
                        <Link href={`${Admin_Media_Show}`}>Back to Media</Link>
                      </Button>
                  }
                </div>
              </div>
            </div>

            {selectMedia.length > 0 && (
              <div className="mt-4 p-2 bg-primary/10 border border-primary/20 rounded-lg flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                <span className="text-sm font-medium text-primary px-2">
                  {selectMedia.length} item{selectMedia.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border hover:bg-gray-50 rounded-md shadow-sm dark:hover:bg-zinc-700 font-medium"
                    onClick={() => {
                      setSelectedMedia([])
                      setSelectAll(false)
                    }}
                  >
                    Deselect All
                  </button>
                  {deleteType === 'PD' && (
                    <button
                      onClick={() => handleRestore(selectMedia)}
                      className="px-3 py-1.5 text-xs bg-green-500 hover:bg-green-600 text-white rounded-md shadow-sm font-medium transition-colors"
                    >
                      Restore
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(selectMedia)}
                    className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm font-medium transition-colors"
                  >
                    {deleteType === 'SD' ? 'Move to Trash' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {/* Select All Bar */}
            <div className='flex items-center space-x-2 mb-6 px-1'>
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium cursor-pointer text-muted-foreground select-none">
                Select All Items
              </Label>
            </div>


            {status === 'pending' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : status === 'error' ? (
              <div className='flex flex-col items-center justify-center p-12 text-center'>
                <p className="text-red-500 font-medium">Failed to load media</p>
                <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {data?.pages?.[0]?.mediaData?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 rounded-full mb-4">
                      <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    </div>
                    <p className="text-lg font-medium">No media found</p>
                    <p className="text-sm opacity-70">Upload some images to get started.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {data?.pages?.map((page, i) => (
                      <React.Fragment key={i}>
                        {page?.mediaData?.map((media) => (
                          <Media
                            key={media._id}
                            media={media}
                            handleDelete={() => handleDelete(media._id)}
                            handleRestore={() => handleRestore(media._id)}
                            deleteType={deleteType}
                            selectMedia={selectMedia}
                            setSelectedMedia={setSelectedMedia}
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {hasNextPage && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isFetchingNextPage ? 'Loading more...' : 'Load More Results'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default MediaPage