import { useEffect } from "react";

import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import MarkBrokenFormFields from "./MarkBrokenFormFields";

import ActionForm from "app/base/components/ActionForm";
import { useMachineActionForm } from "app/machines/hooks";
import type { MachineAction } from "app/store/general/types";
import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { NodeActions } from "app/store/types/node";

const MarkBrokenSchema = Yup.object().shape({
  comment: Yup.string(),
});

type MarkBrokenFormValues = {
  comment: string;
};

type Props = {
  actionDisabled?: boolean;
  setSelectedAction: (action: MachineAction | null, deselect?: boolean) => void;
};

export const MarkBrokenForm = ({
  actionDisabled,
  setSelectedAction,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    NodeActions.MARK_BROKEN
  );

  useEffect(
    () => () => {
      dispatch(machineActions.cleanup());
    },
    [dispatch]
  );

  return (
    <ActionForm
      actionDisabled={actionDisabled}
      actionName={NodeActions.MARK_BROKEN}
      allowAllEmpty
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={errors}
      initialValues={{
        comment: "",
      }}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Mark broken",
      }}
      onSubmit={(values: MarkBrokenFormValues) => {
        machinesToAction.forEach((machine) => {
          dispatch(
            machineActions.markBroken({
              systemId: machine.system_id,
              message: values.comment,
            })
          );
        });
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={MarkBrokenSchema}
    >
      <MarkBrokenFormFields selectedCount={machinesToAction.length} />
    </ActionForm>
  );
};

MarkBrokenForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default MarkBrokenForm;
