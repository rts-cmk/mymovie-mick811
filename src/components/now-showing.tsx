import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StarIcon } from "lucide-react";

export default function NowShowing() {
    const movies = Array.from({ length: 8 }).map((_, index) => (
        <figure key={index} className="shrink-0 md:shrink">
            <div className="overflow-hidden rounded-md">
                <img
                    src="https://placehold.co/300x400"
                    alt="movie poster"
                    className="aspect-[3/4] h-fit w-fit object-cover"
                    width={300}
                    height={400}
                />
            </div>
            <figcaption className="pt-2 text-left">
                Placeholder Title
                <span className="text-muted-foreground text-xs flex items-center gap-1">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    0/10 IMDb
                </span>
            </figcaption>
        </figure>
    ));

    return (
        <>
            <div className="md:hidden">
                <ScrollArea className="w-full rounded-md whitespace-nowrap">
                    <div className="flex w-max space-x-4 py-4">
                        {movies}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>

            <div className="hidden md:grid md:grid-cols-4 gap-4 py-4">
                {movies}
            </div>
        </>
    )
}