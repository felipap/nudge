import { ComponentProps, useEffect, useState } from 'react'

interface Props extends ComponentProps<'img'> {
  src: string
}

export function FsImage({ src, ...props }: Props) {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const result = await window.electronAPI.getImageFromFs(src)
      if ('error' in result) {
        console.error(result.error)
      } else {
        setImage(result.base64 as string)
      }
    }
    load()
  }, [src])

  return <img src={`data:image/png;base64,${image}`} {...props} />
}
