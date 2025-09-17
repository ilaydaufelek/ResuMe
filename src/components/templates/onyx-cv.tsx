import { useFormContext } from "react-hook-form"

export const OnyxCv=()=>{
    const{watch}=useFormContext()
    const values=watch();

    return(
        <div className="text-black">
          {values.fullname}
          {values.email}
        </div>
    )
}