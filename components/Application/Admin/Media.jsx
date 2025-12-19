import { Checkbox } from "@/components/ui/checkbox";
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdDelete, MdRestore } from "react-icons/md";
import { LuLink } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { Admin_Media_Edit } from '@/routes/Admin'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const Media = ({ media, handleDelete, handleRestore, deleteType, selectMedia, setSelectedMedia }) => {

    const handleCheck = (checked) => {
        if (checked) {
            setSelectedMedia(prev => [...prev, media._id])
        } else {
            setSelectedMedia(prev => prev.filter(id => id !== media._id))
        }
    }

    const handleCopyLink = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(media?.secure_url)
        // Add toast here if possible, but keeping it simple for now
    }

    const isSelected = selectMedia.includes(media._id);

    return (
        <div
            className={`
                relative group rounded-xl overflow-hidden cursor-pointer transition-all duration-300
                border-2 ${isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-800'}
            `}
            onClick={() => handleCheck(!isSelected)}
        >
            {/* Selection Overlay */}
            <div className={`
                absolute inset-0 bg-black/40 z-10 transition-opacity duration-200
                ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
            `} />

            {/* Checkbox */}
            <div className={`
                absolute top-3 left-3 z-30 transition-all duration-200
                ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 group-hover:opacity-100 group-hover:scale-100'}
            `}
                onClick={(e) => e.stopPropagation()}
            >
                <Checkbox
                    checked={isSelected}
                    onCheckedChange={handleCheck}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-white/50 bg-black/20"
                />
            </div>

            {/* Vertical Dots Menu */}
            <div className="absolute top-3 right-3 z-30" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/60 transition-colors backdrop-blur-sm opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100">
                            <HiOutlineDotsVertical />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        {deleteType === "SD" ? (
                            <>
                                <DropdownMenuItem asChild>
                                    <Link href={Admin_Media_Edit(media._id)} className="cursor-pointer flex items-center gap-2">
                                        <MdOutlineEdit className="w-4 h-4" />
                                        <span>Edit</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer flex items-center gap-2">
                                    <LuLink className="w-4 h-4" />
                                    <span>Copy Link</span>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <DropdownMenuItem
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRestore();
                                }}
                                className="cursor-pointer flex items-center gap-2 text-green-600 focus:text-green-600"
                            >
                                <MdRestore className="w-4 h-4" />
                                <span>Restore</span>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            className="cursor-pointer text-red-600 focus:text-red-600 flex items-center gap-2"
                        >
                            <MdDelete className="w-4 h-4" />
                            <span>{deleteType === "SD" ? "Move to Trash" : "Delete Permanently"}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Image Container */}
            <div className="aspect-square w-full relative bg-gray-100 dark:bg-gray-900">
                <Image
                    src={media?.secure_url}
                    alt={media?.alt || "Media Item"}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Info Overlay (Bottom) */}
            <div className="absolute bottom-0 left-0 right-0 p-3 z-20 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-xs font-medium truncate">
                    {media?.title || media?.original_filename || "Untitled"}
                </p>
                {media?.file_size && (
                    <p className="text-white/70 text-[10px] uppercase tracking-wider mt-0.5">
                        {(media?.file_size / 1024).toFixed(1)} KB
                    </p>
                )}
            </div>
        </div>
    )
}

export default Media