import React from 'react'
export default ({ title, children }) => {
  return (
    <div className="p-4 mt-2">
      <div className="flex flex-wrap relative p-4 bg-[var(--bg-color)] rounded-[var(--border-radius)] shadow-[var(--box-shadow)]">
        <span className="rounded-t-lg absolute top-[-40px] left-4 bg-[#f9f2f2de] text-[#635b5bfa] text-sm px-1 py-1 m-1">
          {title}
        </span>
        {children}
      </div>
    </div>
  )
}
