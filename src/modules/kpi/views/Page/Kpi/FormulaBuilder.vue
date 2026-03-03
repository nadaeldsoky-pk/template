<template>
  <div class="formula-builder">
    <!-- Formula Preview Card -->
    <div class="formula-preview-card">
      <div class="card-header">
        <i class="fas fa-code me-2"></i>
        {{ $t("kpi.Formula Preview") }}
      </div>
      <div class="card-body">
        <div class="formula-display">
          <span v-if="formulaParts.length === 0" class="formula-placeholder">
            <i class="fas fa-info-circle me-2"></i>
            {{ $t("kpi.No formula defined yet") }}
          </span>
          <template v-else>
            <span
              v-for="(part, index) in formulaParts"
              :key="index"
              class="formula-part"
              :class="`formula-${part.type}`"
            >
              {{ part.value }}
            </span>
          </template>
        </div>
        <!-- <div class="formula-text" v-if="formulaParts.length > 0">
          <code>{{ formulaText }}</code>
        </div> -->
      </div>
    </div>

    <!-- Formula Construction -->
    <div class="formula-construction-card">
      <div class="card-header">
        <i class="fas fa-puzzle-piece me-2"></i>
        {{ $t("kpi.Build Your Formula") }}
      </div>
      <div class="card-body">
        <!-- Controls Row -->
        <div class="controls-row">
          <div class="control-group" v-if="canAddVariable">
            <label class="control-label">
              <i class="fas fa-tag me-1"></i>
              {{ $t("kpi.Select Variable") }}
            </label>
            <select
              v-model="selectedVariable"
              class="form-control-select"
              @change="addVariable"
            >
              <option value="">-- {{ $t("kpi.Select Variable") }} --</option>
              <option v-for="variable in variables" :key="variable.id" :value="variable">
                {{ variable.name }}
              </option>
            </select>
          </div>

          <div class="control-group" v-if="canAddOperator">
            <label class="control-label">
              <i class="fas fa-calculator me-1"></i>
              {{ $t("kpi.Select Operator") }}
            </label>
            <select
              v-model="selectedOperator"
              class="form-control-select"
              @change="addOperator"
            >
              <option value="">-- {{ $t("kpi.Select Operator") }} --</option>
              <option v-for="op in availableOperators" :key="op" :value="op">
                {{ op }}
              </option>
            </select>
          </div>

          <div class="control-group" v-if="canAddParenthesis">
            <label class="control-label">
              <i class="fas fa-brackets-curly me-1"></i>
              {{ $t("kpi.Parentheses") }}
            </label>
            <div class="parenthesis-buttons">
              <button
                type="button"
                class="btn-parenthesis"
                @click="addParenthesis('(')"
                :disabled="!canAddOpeningParenthesis"
              >
                <i class="fas fa-parenthesis me-1"></i> (
              </button>
              <button
                type="button"
                class="btn-parenthesis"
                @click="addParenthesis(')')"
                :disabled="!canAddClosingParenthesis"
              >
                <i class="fas fa-parenthesis me-1"></i> )
              </button>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="formula-actions">
          <div class="action-buttons">
            <button
              type="button"
              class="btn-action btn-clear"
              @click="clearFormula"
              :disabled="formulaParts.length === 0"
            >
              <i class="fas fa-trash-alt me-1"></i> {{ $t("kpi.Clear") }}
            </button>
            <button
              type="button"
              class="btn-action btn-undo"
              @click="removeLast"
              :disabled="formulaParts.length === 0"
            >
              <i class="fas fa-undo me-1"></i> {{ $t("kpi.Remove Last") }}
            </button>
            <button
              type="button"
              class="btn-action btn-save"
              @click="validateAndSave"
              :disabled="shouldDisableSaveButton"
            >
              <i class="fas fa-check-circle me-1"></i> {{ $t("kpi.Save Formula") }}
            </button>
          </div>

          <!-- Status Messages -->
          <div class="status-messages">
            <div v-if="!hasChanges && formulaParts.length > 0" class="status-info">
              <i class="fas fa-info-circle me-2"></i>
              {{ $t("kpi.No changes made to the formula") }}
            </div>

            <div v-if="errorMessage" class="status-error">
              <i class="fas fa-exclamation-triangle me-2"></i>
              {{ errorMessage }}
            </div>

            <div v-if="saveSuccess" class="status-success">
              <i class="fas fa-check-circle me-2"></i>
              {{ $t("kpi.Formula saved successfully!") }}
            </div>
          </div>
        </div>

        <!-- Important Note -->
        <div class="important-note">
          <div class="note-icon">
            <i class="fas fa-exclamation-circle"></i>
          </div>
          <div class="note-content">
            <strong>{{ $t("kpi.Note") }}: </strong>
            {{ $t("kpi.Click Save Formula to apply your formula") }}
          </div>
        </div>
      </div>
    </div>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="showSnackbar"
      color="#6e3894"
      timeout="3000"
      location="top middle"
    >
      <div class="snackbar-content">
        <i class="fas fa-check-circle me-2"></i>
        {{ $t("kpi.kpi_variables_added_successfully") }}
      </div>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "FormulaBuilder",
  props: {
    variables: {
      type: Array,
      required: true,
      default: () => [],
    },
    initialFormula: {
      type: String,
      default: "",
    },
    initialFormulaParts: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      formulaParts: [],
      selectedVariable: null,
      variableValue: null,
      selectedOperator: null,
      operators: ["+", "-", "*", "/"],
      errorMessage: "",
      helpText: this.$t("kpi.HelpText"),
      isManualInput: false,
      showSnackbar: false,
      hasChanges: false,
      originalFormulaParts: [],
      saveSuccess: false,
    };
  },
  computed: {
    canAddVariable() {
      if (this.formulaParts.length === 0) return true;
      const lastPart = this.formulaParts[this.formulaParts.length - 1];
      return lastPart.type === "operator" || lastPart.value === "(";
    },

    canAddOperator() {
      if (this.formulaParts.length === 0) return false;
      const lastPart = this.formulaParts[this.formulaParts.length - 1];
      return (
        lastPart.type === "variable" ||
        lastPart.type === "value" ||
        lastPart.value === ")"
      );
    },

    canAddParenthesis() {
      return true;
    },

    canAddOpeningParenthesis() {
      if (this.formulaParts.length === 0) return true;
      const lastPart = this.formulaParts[this.formulaParts.length - 1];
      return lastPart.type === "operator" || lastPart.value === "(";
    },

    canAddClosingParenthesis() {
      if (this.formulaParts.length === 0) return false;

      let balance = 0;
      for (const part of this.formulaParts) {
        if (part.value === "(") balance++;
        if (part.value === ")") balance--;
      }

      const lastPart = this.formulaParts[this.formulaParts.length - 1];
      return (
        balance > 0 &&
        (lastPart.type === "variable" ||
          lastPart.type === "value" ||
          lastPart.value === ")")
      );
    },

    availableOperators() {
      return this.operators;
    },

    formulaText() {
      return this.buildFormulaText();
    },

    isFormulaValid() {
      if (this.formulaParts.length === 0) return false;

      const lastPart = this.formulaParts[this.formulaParts.length - 1];
      if (lastPart.type === "operator" || lastPart.value === "(") return false;

      let balance = 0;
      for (const part of this.formulaParts) {
        if (part.value === "(") balance++;
        if (part.value === ")") balance--;
        if (balance < 0) return false;
      }

      return balance === 0;
    },

    hasFormulaChanged() {
      if (this.originalFormulaParts.length !== this.formulaParts.length) {
        return true;
      }
      return (
        JSON.stringify(this.originalFormulaParts) !== JSON.stringify(this.formulaParts)
      );
    },

    shouldDisableSaveButton() {
      return !this.isFormulaValid || !this.hasChanges;
    },
  },
  watch: {
    variables: {
      deep: true,
      immediate: true,
      handler(newVal) {
        this.clearFormula();
        this.checkForChanges();
      },
    },
    formulaParts: {
      deep: true,
      handler() {
        this.checkForChanges();
      },
    },
    initialFormulaParts: {
      deep: true,
      immediate: true,
      handler(newParts) {
        if (newParts && newParts.length > 0) {
          this.loadFormulaParts(newParts);
        }
      },
    },
  },
  created() {
    if (this.initialFormulaParts && this.initialFormulaParts.length > 0) {
      this.formulaParts = [...this.initialFormulaParts];
      this.originalFormulaParts = JSON.parse(JSON.stringify(this.initialFormulaParts));
      this.$emit("formula-saved", {
        formula: this.formulaText,
        parts: this.initialFormulaParts,
        variables: this.variables,
      });
    } else if (this.initialFormula) {
      this.parseFormula(this.initialFormula);
      this.originalFormulaParts = JSON.parse(JSON.stringify(this.formulaParts));
    }
    this.hasChanges = false;
  },
  methods: {
    loadFormulaParts(parts) {
      this.formulaParts = JSON.parse(JSON.stringify(parts));
      this.originalFormulaParts = JSON.parse(JSON.stringify(parts));
      this.hasChanges = false;
    },

    checkForChanges() {
      this.hasChanges = this.hasFormulaChanged;
    },

    parseFormula(formula) {
      this.formulaParts = [];
      if (!formula) return;

      try {
        const parsed = JSON.parse(formula);
        if (Array.isArray(parsed)) {
          this.formulaParts = parsed;
          return;
        }
      } catch (e) {}

      const tokens = formula.split(/([+\-*/()])|\s+/).filter((t) => t && t.trim());
      tokens.forEach((token) => {
        token = token.trim();
        if (token.match(/^[+\-*/]$/)) {
          this.formulaParts.push({ type: "operator", value: token });
          return;
        }

        if (token.match(/^[()]$/)) {
          this.formulaParts.push({ type: "parenthesis", value: token });
          return;
        }

        if (!isNaN(token)) {
          this.formulaParts.push({ type: "value", value: token });
          return;
        }

        const variable = this.variables.find((v) => v.name === token || v.id === token);
        if (variable) {
          this.formulaParts.push({
            type: "variable",
            value: variable.name,
            variable: variable.id,
          });
        }
      });
    },

    buildFormulaText() {
      return this.formulaParts
        .map((part) => {
          if (part.type === "variable") {
            const foundVar = this.variables.find((v) => v.id === part.variable);
            return foundVar ? foundVar.name : part.value;
          }
          return part.value;
        })
        .join(" ");
    },

    addVariable() {
      if (!this.selectedVariable) return;

      if (!this.canAddVariable) {
        this.errorMessage = this.$t(
          "kpi.Cannot add variable here You need an operator or parenthesis first"
        );
        return;
      }

      this.formulaParts.push({
        type: "variable",
        value: this.selectedVariable.name,
        variable: this.selectedVariable.id,
      });

      this.selectedVariable = null;
      this.errorMessage = "";
      this.hasChanges = true;
    },

    addOperator() {
      if (!this.selectedOperator) return;

      if (!this.canAddOperator) {
        this.errorMessage = this.$t(
          "kpi.Cannot add operator here You need a variable or value first"
        );
        return;
      }

      this.formulaParts.push({
        type: "operator",
        value: this.selectedOperator,
      });
      this.selectedOperator = null;
      this.errorMessage = "";
      this.hasChanges = true;
    },

    addParenthesis(paren) {
      if (paren === "(" && !this.canAddOpeningParenthesis) {
        this.errorMessage = this.$t("kpi.Cannot add opening parenthesis here");
        return;
      }

      if (paren === ")" && !this.canAddClosingParenthesis) {
        this.errorMessage = this.$t("kpi.Cannot add closing parenthesis here");
        return;
      }

      this.formulaParts.push({ type: "parenthesis", value: paren });
      this.errorMessage = "";
      this.hasChanges = true;
    },

    removeLast() {
      this.formulaParts.pop();
      this.hasChanges = true;
      if (this.formulaParts.length === 0) {
        this.$emit("formula-saved", {
          formula: "",
          parts: [],
          variables: "",
        });
      }
    },

    clearFormula() {
      this.formulaParts = [];
      this.selectedVariable = null;
      this.selectedOperator = null;
      this.errorMessage = "";
      this.hasChanges = true;

      this.$emit("formula-saved", {
        formula: "",
        parts: [],
        variables: "",
      });
    },

    validateAndSave() {
      if (!this.hasChanges) {
        this.errorMessage = this.$t("kpi.No changes to save");
        return;
      }

      const simplifiedParts = this.formulaParts.map((part) => {
        if (part.type === "variable") {
          return {
            type: part.type,
            value: part.value,
            variable: part.variable,
          };
        }
        return part;
      });

      this.originalFormulaParts = JSON.parse(JSON.stringify(this.formulaParts));
      this.hasChanges = false;
      this.saveSuccess = true;
      this.showSnackbar = true;

      setTimeout(() => {
        this.saveSuccess = false;
      }, 3000);

      this.$emit("formula-saved", {
        formula: this.formulaText,
        parts: simplifiedParts,
        variables: this.variables,
      });
    },
  },
};
</script>

<style scoped>
.formula-builder {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
}

/* Card Styles */
.formula-preview-card,
.formula-construction-card {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  border: 1px solid #e8e8e8;
}

.card-header {
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #1e293b;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.card-header i {
  color: #6e3894;
}

.card-body {
  padding: 20px;
}

/* Formula Display */
.formula-display {
  min-height: 60px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.formula-placeholder {
  color: #94a3b8;
  font-style: italic;
  display: flex;
  align-items: center;
}

.formula-part {
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
}

.formula-variable {
  background: rgba(110, 56, 148, 0.1);
  color: #6e3894;
  border: 1px solid rgba(110, 56, 148, 0.2);
}

.formula-operator {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.formula-value {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.formula-parenthesis {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.formula-text {
  margin-top: 12px;
  padding: 12px;
  background: #1e293b;
  color: #f1f5f9;
  border-radius: 6px;
  font-family: "Courier New", monospace;
  font-size: 14px;
  word-break: break-all;
}

/* Controls */
.controls-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-weight: 500;
  color: #374151;
  font-size: 13px;
  display: flex;
  align-items: center;
}

.control-label i {
  color: #6e3894;
  width: 16px;
}

.form-control-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  font-size: 14px;
  transition: all 0.2s ease;
}

.form-control-select:focus {
  outline: none;
  border-color: #6e3894;
  box-shadow: 0 0 0 3px rgba(110, 56, 148, 0.1);
}

.parenthesis-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.btn-parenthesis {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #ffffff;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-parenthesis:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #6e3894;
  color: #6e3894;
}

.btn-parenthesis:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Action Buttons */
.formula-actions {
  margin-top: 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-action {
  height: 25px;
  padding: 7px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.btn-clear {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-clear:hover:not(:disabled) {
  background: #fecaca;
}

.btn-undo {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fed7aa;
}

.btn-undo:hover:not(:disabled) {
  background: #fed7aa;
}

.btn-save {
  background: #6e3894;
  color: #ffffff;
  border: 1px solid #6e3894;
}

.btn-save:hover:not(:disabled) {
  background: #5c2d7a;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Status Messages */
.status-messages {
  margin-top: 16px;
}

.status-info,
.status-error,
.status-success {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.status-info {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.status-error {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.status-success {
  background: rgba(16, 185, 129, 0.1);
  color: #047857;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* Important Note */
.important-note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 8px;
  margin-top: 20px;
}

.note-icon {
  color: #d97706;
  font-size: 18px;
  margin-top: 2px;
}

.note-content {
  color: #92400e;
  font-size: 14px;
  line-height: 1.5;
}

/* Snackbar */
.snackbar-content {
  display: flex;
  align-items: center;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .controls-row {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-action {
    justify-content: center;
  }

  .parenthesis-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .card-body {
    padding: 16px;
  }

  .formula-display {
    padding: 12px;
  }

  .formula-part {
    padding: 6px 10px;
    font-size: 13px;
  }
}
</style>
