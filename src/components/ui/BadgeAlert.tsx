interface Props {
  alertText: string;
}

export const BadgeAlert = ({ alertText }: Props) => {
  return (
    <div className="flex items-start sm:items-center p-4 mb-4 text-sm text-green-700 dark:text-green-400 rounded-lg bg-green-200/40 border border-green-400 absolute bottom-1 right-5" role="alert">
      <svg className="w-4 h-4 me-2 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
      <p><span className="font-medium">{alertText}</span></p>
    </div>
  )
}
