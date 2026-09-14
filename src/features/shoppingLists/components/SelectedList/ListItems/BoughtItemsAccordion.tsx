import { Disclosure } from "@heroui/react"
import { ListItem } from "@/types"
import { ListItemRow } from "./ListItemRow"

interface Props {
    items: ListItem[]
}

export const BoughtItemsAccordion = ({ items }: Props) => {
    return (
        <Disclosure className="border-t border-gray-200">
            <Disclosure.Heading>
                <Disclosure.Trigger
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-500"
                >
                    <span>Bought ({items.length})</span>
                    <Disclosure.Indicator />
                </Disclosure.Trigger>
            </Disclosure.Heading>
            <Disclosure.Content>
                <Disclosure.Body>
                    {items.map((item) => (
                        <ListItemRow item={item} key={item.id} />
                    ))}
                </Disclosure.Body>
            </Disclosure.Content>
        </Disclosure>
    )
}
