import React from "react";
import { StudioSpecV1 } from "../../lib/schema/studio-spec";

import { SystemMap } from "./modules/SystemMap";
import { ModuleCards } from "./modules/ModuleCards";
import { TradeoffMatrix } from "./modules/TradeoffMatrix";
import { RiskPanel } from "./modules/RiskPanel";
import { ConceptCards } from "./modules/ConceptCards";
import { ComparisonPanel } from "./modules/ComparisonPanel";
import { Timeline } from "./modules/Timeline";
import { ExplainerSection } from "./modules/ExplainerSection";
import { ScorecardPanel } from "./modules/ScorecardPanel";
import { QuizModule } from "./modules/QuizModule";
import { DiagramModule } from "./modules/DiagramModule";
import { Dashboard } from "./modules/Dashboard";
import { ActionPlan } from "./modules/ActionPlan";
import { InteractiveCalculator } from "./modules/InteractiveCalculator";
import { DecisionTree } from "./modules/DecisionTree";
import { ProsCons } from "./modules/ProsCons";
import { ChecklistModule } from "./modules/ChecklistModule";
import { RecipeModule } from "./modules/RecipeModule";
import { HierarchyTree } from "./modules/HierarchyTree";
import { MindMap } from "./modules/MindMap";
import { FlashcardDeck } from "./modules/FlashcardDeck";
import { NumberedProcess } from "./modules/NumberedProcess";
import { ScenarioComparison } from "./modules/ScenarioComparison";

const Registry: Record<string, React.FC<any>> = {
    SystemMap,
    ModuleCards,
    TradeoffMatrix,
    RiskPanel,
    ConceptCards,
    ComparisonPanel,
    Timeline,
    ExplainerSection,
    ScorecardPanel,
    QuizModule,
    DiagramModule,
    Dashboard,
    ActionPlan,
    InteractiveCalculator,
    DecisionTree,
    ProsCons,
    ChecklistModule,
    RecipeModule,
    HierarchyTree,
    MindMap,
    FlashcardDeck,
    NumberedProcess,
    ScenarioComparison,
};

const ErrorCallout = ({ slot, errorCode, message }: { slot: string; errorCode: string; message: string }) => (
    <div className="p-4 border-l-4 border-red-400 bg-red-50 text-red-700 rounded-r-xl">
        <h3 className="font-semibold text-sm">Failed to render: {slot}</h3>
        <p className="text-xs mt-0.5 text-red-600">{errorCode}: {message}</p>
    </div>
);

export const ModuleRegistryRenderer = ({
    spec,
    computedBySlot,
    slotErrors,
}: {
    spec: StudioSpecV1;
    computedBySlot: Record<string, any>;
    slotErrors: Record<string, string>;
}) => {
    return (
        <div className="w-full flex flex-col space-y-6 p-6">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{spec?.title}</h1>

            {(spec?.modules || []).map((inv) => {
                if (slotErrors?.[inv?.slot]) {
                    return (
                        <ErrorCallout
                            key={inv.slot}
                            slot={inv.slot}
                            errorCode="VALIDATION_FAILED"
                            message={slotErrors[inv.slot]}
                        />
                    );
                }

                const ModuleComponent = Registry[inv?.module];
                if (!ModuleComponent) {
                    return (
                        <ErrorCallout
                            key={inv?.slot ?? Math.random().toString()}
                            slot={inv?.slot ?? 'unknown'}
                            errorCode="REGISTRY_MISS"
                            message={`Module "${inv?.module}" is not registered.`}
                        />
                    );
                }

                const computed = computedBySlot?.[inv.slot] ?? {};

                return (
                    <div key={inv.slot} data-slot={inv?.slot}>
                        <ModuleComponent
                            config={inv.config ?? {}}
                            computed={computed}
                            slot={inv.slot}
                        />
                    </div>
                );
            })}
        </div>
    );
};
