import ActivitiesIcon from "@/assets/icons/emoji-groups/activities"
import AnimalNatureIcon from "@/assets/icons/emoji-groups/animals_nature"
import FlagsIcon from "@/assets/icons/emoji-groups/flags"
import FoodDrinkIcon from "@/assets/icons/emoji-groups/food_drink"
import ObjectsIcon from "@/assets/icons/emoji-groups/objects"
import PeopleBodyIcon from "@/assets/icons/emoji-groups/people_body"
import SmileyEmotionIcon from "@/assets/icons/emoji-groups/smiley_emotion"
import SymbolsIcon from "@/assets/icons/emoji-groups/symbols"
import TravelPlacesIcon from "@/assets/icons/emoji-groups/travel_places"
import { useState } from "react"
import data from "unicode-emoji-json/data-by-group.json"

const grouptoicon: {
    [key: string]: React.FC<{width: string}>
} = {
    "smileys_emotion": SmileyEmotionIcon,
    "people_body": PeopleBodyIcon,
    "animals_nature": AnimalNatureIcon,
    "food_drink": FoodDrinkIcon,
    "travel_places": TravelPlacesIcon,
    "activities": ActivitiesIcon,
    "objects": ObjectsIcon,
    "symbols": SymbolsIcon,
    "flags": FlagsIcon,
}

type EmojiPickerProps = {
    onChoose(emoji: string): void,
}

export default function EmojiPicker({ onChoose }: EmojiPickerProps) {

    const [group, setGroup] = useState<number>(0);

    return (
        <div className="bg-background border-2 border-foreground rounded-xl w-full h-full flex flex-col">
            <div className="flex gap-2 w-full overflow-auto">
                {data.map((entry, i) => {
                    const Elem = grouptoicon[entry.slug];
                    return (
                        <div key={i} onClick={() => setGroup(i)} className="p-2 cursor-pointer">
                            <Elem width="25"/>
                        </div>
                    )
                })}
            </div>
            <div className="flex flex-wrap h-full justify-between overflow-auto">
                {data[group].emojis.map((emoji, i) => {
                    return (
                        <div onClick={() => onChoose(emoji.emoji)} key={i} className="text-3xl p-1 cursor-pointer">{emoji.emoji}</div>
                    )
                })}
            </div>
        </div>
    )
}