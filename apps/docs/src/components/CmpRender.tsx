import { ReactNode } from 'react'

export const CmpRender = ({ className, children }: { className?: string; children: ReactNode }) => {
    return <div className={`bg-gray-50 p-4 rounded-md ${className}`}> {children} </div>
}
