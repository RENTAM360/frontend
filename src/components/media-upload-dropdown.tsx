import { useState, useRef } from "react"
import { FileText } from "lucide-react"
import { useUploadEquipmentImagesMutation, useUploadEquipmentDocumentsMutation } from "@/lib/redux/api/equipmentApi"

export function MediaUploadDropdown({ onUpload }: { onUpload: (urls: string[]) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadImage] = useUploadEquipmentImagesMutation()
  const [uploadDocument] = useUploadEquipmentDocumentsMutation()

  const imageInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (type: "image" | "document", files: FileList) => {
    try {
      let result
      if (type === "image") {
        result = await uploadImage(Array.from(files)).unwrap()
      } else {
        result = await uploadDocument(Array.from(files)).unwrap()
      }

      type UploadResponseItem = string | { url: string }

    const urls: string[] = Array.isArray(result.data)
      ? (result.data as UploadResponseItem[]).map((item) =>
          typeof item === "string" ? item : item.url
        )
      : []

    onUpload(urls)

      setIsOpen(false)
    } catch (err) {
      console.error("Upload failed:", err)
    }
  }

  return (
    <div className="relative">
      {/* Paperclip Icon */}
        <button type="button" onClick={() => setIsOpen((prev) => !prev)} className="flex-shrink-0 bg-primary w-8 h-8 flex justify-center items-center cursor-pointer rounded-full p-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.1667 7.16665C13.0871 7.16665 13.8333 6.42045 13.8333 5.49998C13.8333 4.57951 13.0871 3.83331 12.1667 3.83331C11.2462 3.83331 10.5 4.57951 10.5 5.49998C10.5 6.42045 11.2462 7.16665 12.1667 7.16665Z" stroke="white"/>
                <path d="M0.5 9.24999L1.96 7.97249C2.32595 7.65255 2.79979 7.48361 3.2856 7.49985C3.77142 7.5161 4.23291 7.71632 4.57667 8.05999L8.15167 11.635C8.42909 11.9124 8.79546 12.083 9.18629 12.1168C9.57712 12.1507 9.96737 12.0455 10.2883 11.82L10.5375 11.645C11.0005 11.3198 11.5601 11.1613 12.1249 11.1954C12.6896 11.2294 13.2261 11.454 13.6467 11.8325L16.3333 14.25" stroke="white" strokeLinecap="round"/>
                <path d="M17.1667 8.83333C17.1667 12.7617 17.1667 14.7258 15.9458 15.9458C14.7267 17.1667 12.7617 17.1667 8.83333 17.1667C4.905 17.1667 2.94083 17.1667 1.72 15.9458C0.5 14.7267 0.5 12.7617 0.5 8.83333C0.5 4.905 0.5 2.94083 1.72 1.72C2.94167 0.5 4.905 0.5 8.83333 0.5C12.7617 0.5 14.7258 0.5 15.9458 1.72C16.7575 2.53167 17.0292 3.6725 17.1208 5.5" stroke="white" strokeLinecap="round"/>
            </svg>
        </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute bottom-13 left-0 bg-white rounded-lg w-40 z-[999999]">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="flex justify-between items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-sm"
          >
           
            <p>Image</p>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.3327 8.33333C14.2532 8.33333 14.9993 7.58714 14.9993 6.66667C14.9993 5.74619 14.2532 5 13.3327 5C12.4122 5 11.666 5.74619 11.666 6.66667C11.666 7.58714 12.4122 8.33333 13.3327 8.33333Z" stroke="black"/>
                <path d="M1.66602 10.4166L3.12602 9.13915C3.49196 8.81921 3.9658 8.65026 4.45162 8.66651C4.93743 8.68275 5.39893 8.88298 5.74268 9.22665L9.31768 12.8016C9.59511 13.079 9.96148 13.2496 10.3523 13.2835C10.7431 13.3173 11.1334 13.2122 11.4544 12.9866L11.7035 12.8116C12.1665 12.4865 12.7261 12.328 13.2909 12.362C13.8556 12.3961 14.3921 12.6207 14.8127 12.9991L17.4994 15.4166" stroke="black" strokeLinecap="round"/>
                <path d="M18.3327 9.99999C18.3327 13.9283 18.3327 15.8925 17.1118 17.1125C15.8927 18.3333 13.9277 18.3333 9.99935 18.3333C6.07102 18.3333 4.10685 18.3333 2.88602 17.1125C1.66602 15.8933 1.66602 13.9283 1.66602 9.99999C1.66602 6.07166 1.66602 4.10749 2.88602 2.88666C4.10768 1.66666 6.07102 1.66666 9.99935 1.66666C13.9277 1.66666 15.8918 1.66666 17.1118 2.88666C17.9235 3.69832 18.1952 4.83916 18.2868 6.66666" stroke="black" strokeLinecap="round"/>
            </svg>
           
          </button>
          <button
            onClick={() => docInputRef.current?.click()}
            className="flex justify-between items-center gap-2 px-4 py-2 hover:bg-gray-50 w-full text-sm"
          >
           <p>Document</p> <FileText className="w-5 h-5 font-medium text-black" /> 
          </button>
        </div>
      )}

      {/* Hidden Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => e.target.files && handleFileUpload("image", e.target.files)}
      />
      <input
        ref={docInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        multiple
        hidden
        onChange={(e) => e.target.files && handleFileUpload("document", e.target.files)}
      />
    </div>
  )
}
