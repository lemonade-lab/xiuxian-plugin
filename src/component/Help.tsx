import React from 'react'
export default ({ list }: { list: string[] }) => {
  return (
    <div className="p-4 mt-2">
      <div className="p-4 relative flex flex-wrap bg-[var(--inset-bg-color)] rounded-[var(--border-radius)] shadow-[var(--inset-box-shadow)]">
        <span className="rounded-t-lg absolute top-[-40px] left-4 bg-[#f9f2f2de] text-[#635b5bfa] text-sm px-1 py-1 m-1">
          修仙小助手
        </span>
        {list.map((item, index) => (
          <span
            key={index}
            className="bg-[#f9f2f2de] text-[#635b5bfa] rounded-md text-sm px-1 py-1 m-1"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
