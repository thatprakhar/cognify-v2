import React from "react";
import { StudioSpecV1 } from "../../lib/schema/studio-spec";

// Dynamic imports or direct references for modules
import { SystemMap } from "./modules/SystemMap";
import { ModuleCards } from "./modules/ModuleCards";
import { TradeoffMatrix } from "./modules/TradeoffMatrix";
import { RiskPanel } from "./modules/RiskPanel";

const Registry: Record<string, React.FC<any>> = {
    SystemMap,
    ModuleCards,
    TradeoffMatrix,
    RiskPanel,
};

// Deterministic error callout for isolated partial failures
const ErrorCallout = ({ slot, errorCode, message }: any) => (
    <div className="p-4 border-l-4 border-red-500 bg-red-50 text-red-700 mb-4 rounded-r-md">
        <h3 className="font-bold text-sm">Failed to generate {slot}</h3>
        <p className="text-sm">{errorCode}: {message}</p>
        <button className="mt-2 text-xs bg-red-100 px-2 py-1 rounded hover:bg-red-200" onClick={() => {
            // Dispatch regenerate event
        }}>
            Retry
        </button>
    </div>
);

export const ModuleRegistryRenderer = ({ spec, computedBySlot, slotErrors }: { spec: StudioSpecV1, computedBySlot: any, slotErrors: any }) => {
    return (
        <div className="w-full flex flex-col space-y-8 p-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{spec?.title}</h1>

            {(spec?.modules || []).map((inv) => {
                const ModuleComponent = Registry[inv?.module];

                if (slotErrors && slotErrors[inv?.slot]) {
                    return <ErrorCallout key={inv.slot || Math.random()} slot={inv.slot} errorCode="VALIDATION_FAILED" message={slotErrors[inv.slot]} />;
                }

                if (!ModuleComponent) {
                    return <ErrorCallout key={inv?.slot || Math.random()} slot={inv?.slot} errorCode="REGISTRY_MISS" message={`Module ${inv?.module} is not registered.`} />;
                }

                const computed = computedBySlot ? computedBySlot[inv.slot] : {};

                return (
                    <div key={inv.slot || Math.random()} className="module-slot" data-slot={inv?.slot}>
                        <ModuleComponent config={inv.config || {}} computed={computed || {}} slot={inv.slot} />
                    </div>
                );
            })}
        </div>
    );
};
