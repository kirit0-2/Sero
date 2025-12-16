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
import { Divide } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'

const BreadCrumbData = [
  { label: "Home", href: Admin_Dashboard, },
  { label: "Media", href: "", },
]

const MediaPage = () => {

  const [deleteType, setDeleteType] = useState("SD")
  const [selectMedia, setSelectedMedia] = useState([])

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
    isFetching,
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
  return (
    <>
      <div>
        <BreadCrumb data={BreadCrumbData} />
        <Card className='p-0'>
          <CardHeader className='pb-4 border-b'>
Ser            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h4 className='font-bold text-2xl tracking-tight'>{deleteType === 'SD' ? 'Media' : 'Trash'}</h4>
                <p className='text-sm text-muted-foreground'>Manage your images and assets.</p>
              </div>
              <div className='flex items-center gap-3'>
                {deleteType === 'SD' && <UploadMedia />}
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
                    className="px-3 py-1.5 text-xs bg-white dark:bg-zinc-800 border hover:bg-gray-50 rounded-md shadow-sm dark:hover:bg-zinc-700"
                    onClick={() => setSelectedMedia([])}
                  >
                    Deselect All
                  </button>
                  <button
                    className="px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
                  >
                    {deleteType === 'SD' ? 'Move to Trash' : 'Delete Permanently'}
                  </button>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {selectMedia.length > 0
              &&
              <div className='py-2 px-3 bg-violet-200 mb-2 rounded flex justify-between items-center'>
                <Label>
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={handleSelectAll}
                  />
                  Select All
                </Label>

              </div>
            }


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