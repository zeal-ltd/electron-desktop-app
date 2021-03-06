import { PlusIcon } from "./icons/plusIcon";
import { MinusIcon } from "./icons/minusIcon";

import "./stepper.scss";
import { Input } from "./input";
import { useEffect, useState } from "react";

export const StepperWithQuantityInput = (props: IProps) => {
    const [value, setValue] = useState(props.count);

    useEffect(() => {
        setValue(props.count);
    }, [props.count]);

    const iconHeight = String(props.size / 1.8) + "px";
    const borderHeight = String(props.size) + "px";

    // callbacks
    const onMinusClick = () => {
        if (props.disabled) {
            return;
        }

        if (!props.allowNegative && props.count == 0) {
            return;
        }

        if (props.min == props.count) {
            return;
        }

        const cnt = props.count - 1;
        props.setCount && props.setCount(cnt);
        props.onUpdate && props.onUpdate(cnt);
        props.onDecrement && props.onDecrement(cnt);
    };

    const onPlusClick = () => {
        if (props.disabled) {
            return;
        }

        if (props.max == props.count) {
            return;
        }

        const cnt = props.count + 1;
        props.setCount && props.setCount(cnt);
        props.onUpdate && props.onUpdate(cnt);
        props.onIncrement && props.onIncrement(cnt);
    };

    const minusButtonDisabled = props.count === props.min || props.disabled;

    const minusButton = (
        <div
            className={`stepper-button ${minusButtonDisabled ? "disabled" : ""}`}
            style={{ height: borderHeight, width: borderHeight }}
            onClick={onMinusClick}
        >
            <MinusIcon height={iconHeight} />
        </div>
    );

    const plusButtonDisabled = props.count === props.max || props.disabled;

    const plusButton = (
        <div
            className={`stepper-button ${plusButtonDisabled ? "disabled" : ""}`}
            style={{ height: borderHeight, width: borderHeight }}
            onClick={onPlusClick}
        >
            <PlusIcon height={iconHeight} />
        </div>
    );

    const onQuantityUpdateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onUpdate && props.onUpdate(value);
    };

    const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value);

        setValue(newValue);
    };

    return (
        <>
            <div className="stepper-container">
                <div className={`stepper ${props.className}`} style={props.style}>
                    {minusButton}
                    <div
                        style={{
                            textAlign: "center",
                            padding: `0 ${props.size / (1.8 * 4)}px`,
                            fontSize: props.size / 1.8,
                        }}
                    >
                        {/* {props.count} */}
                        <Input type="number" onBlur={onQuantityUpdateInput} value={value} onChange={onChangeValue} />
                    </div>
                    {plusButton}
                </div>
                {props.children && <div className="stepper-children ml-3">{props.children}</div>}
            </div>
        </>
    );
};

export interface IProps {
    children?: React.ReactNode;
    count: number;
    setCount?: (count: number) => void;
    allowNegative?: boolean; // default false
    min?: number;
    max?: number;
    onUpdate?: (count: number) => void;
    onIncrement?: (count: number) => void;
    onDecrement?: (count: number) => void;
    disabled?: boolean;
    size: number; // pixels
    style?: React.CSSProperties;
    className?: string;
}
