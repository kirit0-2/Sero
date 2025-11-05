import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

export function ButtonLoading({ type, text, className, loading, onClick, ...props }) {
    return (
        <Button 
            type={type}
            className={cn("", className)}
            onClick={null}
            disabled={loading}
            {...props}>
            {loading &&
                <Spinner/>
            }
            {text}
        </Button>
    )
}
