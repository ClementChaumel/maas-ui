import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import { actions as machineActions } from "app/store/machine";
import { useMachineActionForm } from "app/machines/hooks";
import machineSelectors from "app/store/machine/selectors";
import { actions as tagActions } from "app/store/tag";
import tagSelectors from "app/store/tag/selectors";
import ActionForm from "app/base/components/ActionForm";
import TagFormFields from "./TagFormFields";
import { NodeActions } from "app/store/types/node";

const TagFormSchema = Yup.object().shape({
  tags: Yup.array()
    .of(Yup.string())
    .min(1)
    .required("You must select at least one tag."),
});

export const TagForm = ({ actionDisabled, setSelectedAction }) => {
  const dispatch = useDispatch();
  const activeMachine = useSelector(machineSelectors.active);
  const [initialValues, setInitialValues] = useState({ tags: [] });
  const tagsLoaded = useSelector(tagSelectors.loaded);
  const { errors, machinesToAction, processingCount } = useMachineActionForm(
    NodeActions.TAG
  );

  const formErrors = { ...errors };
  if (formErrors && formErrors.name) {
    formErrors.tags = formErrors.name;
    delete formErrors.name;
  }

  useEffect(() => {
    dispatch(tagActions.fetch());
  }, [dispatch]);

  return (
    <ActionForm
      actionDisabled={actionDisabled}
      actionName={NodeActions.TAG}
      cleanup={machineActions.cleanup}
      clearSelectedAction={() => setSelectedAction(null, true)}
      errors={formErrors}
      initialValues={initialValues}
      loaded={tagsLoaded}
      modelName="machine"
      onSaveAnalytics={{
        action: "Submit",
        category: `Machine ${activeMachine ? "details" : "list"} action form`,
        label: "Tag",
      }}
      onSubmit={(values) => {
        if (values.tags && values.tags.length) {
          machinesToAction.forEach((machine) => {
            dispatch(
              machineActions.tag({
                systemId: machine.system_id,
                tags: values.tags,
              })
            );
          });
        }
        setInitialValues(values);
      }}
      processingCount={processingCount}
      selectedCount={machinesToAction.length}
      validationSchema={TagFormSchema}
    >
      <TagFormFields />
    </ActionForm>
  );
};

TagForm.propTypes = {
  setSelectedAction: PropTypes.func.isRequired,
};

export default TagForm;
