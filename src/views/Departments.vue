<template>
  <v-container fluid>

    <!-- Header -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <div class="text-h5 font-weight-bold">الأقسام</div>
        <div class="text-body-2 text-medium-emphasis mt-1">إدارة أقسام وحدات الأعمال</div>
      </div>
      <v-btn color="primary" prepend-icon="mdi-plus" rounded="lg" elevation="0" @click="openForm()">
        إضافة قسم
      </v-btn>
    </div>

    <!-- Search Bar -->
    <v-card rounded="lg" elevation="0" border class="mb-4 pa-3">
      <v-text-field
        v-model="search"
        placeholder="بحث في الأقسام..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="compact"
        hide-details
        rounded="lg"
        clearable
        style="max-width: 380px"
      />
    </v-card>

    <!-- Data Table -->
    <v-card rounded="lg" elevation="0" border>
      <v-data-table
        :headers="headers"
        :items="filteredDepartments"
        :search="search"
        items-per-page="10"
        class="rtl-table"
      >
        <!-- Status chip -->
        <template #item.status="{ item }">
          <v-chip
            :color="item.status === 'active' ? 'success' : 'error'"
            size="small"
            variant="tonal"
          >
            {{ item.status === 'active' ? 'نشط' : 'غير نشط' }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex gap-1">
            <v-btn icon size="small" variant="text" color="primary" @click="openForm(item)">
              <v-icon size="18">mdi-pencil-outline</v-icon>
            </v-btn>
            <v-btn icon size="small" variant="text" color="error" @click="confirmDelete(item)">
              <v-icon size="18">mdi-delete-outline</v-icon>
            </v-btn>
          </div>
        </template>

        <!-- Empty state -->
        <template #no-data>
          <div class="text-center py-8 text-medium-emphasis">
            <v-icon size="48" class="mb-2">mdi-inbox-outline</v-icon>
            <div>لا توجد بيانات</div>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add / Edit Dialog -->
    <v-dialog v-model="dialog" max-width="680" persistent>
      <v-card rounded="xl" elevation="4">
        <div class="bg-primary px-6 py-4 d-flex align-center justify-space-between rounded-t-xl">
          <span class="text-white text-h6 font-weight-bold">
            {{ editingItem ? 'تعديل القسم' : 'إضافة قسم جديد' }}
          </span>
          <v-btn icon variant="text" color="white" size="small" @click="closeForm">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <label class="text-sm font-weight-bold mb-1 d-block">اسم القسم <span class="text-error">*</span></label>
              <v-text-field
                v-model="formData.name"
                variant="outlined"
                density="compact"
                placeholder="أدخل اسم القسم"
                rounded="lg"
                hide-details="auto"
                :error-messages="errors.name"
              />
            </v-col>

            <v-col cols="12" md="6">
              <label class="text-sm font-weight-bold mb-1 d-block">كود القسم <span class="text-error">*</span></label>
              <v-text-field
                v-model="formData.code"
                variant="outlined"
                density="compact"
                placeholder="مثال: IT-001"
                rounded="lg"
                hide-details="auto"
                :error-messages="errors.code"
              />
            </v-col>

            <v-col cols="12" md="6">
              <label class="text-sm font-weight-bold mb-1 d-block">وحدة الأعمال <span class="text-error">*</span></label>
              <!-- LazySelect (static options) -->
              <v-autocomplete
                v-model="formData.business_unit_id"
                :items="businessUnits"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="compact"
                placeholder="اختر وحدة الأعمال"
                rounded="lg"
                hide-details="auto"
                :error-messages="errors.business_unit_id"
                clearable
              />
            </v-col>

            <v-col cols="12" md="6">
              <label class="text-sm font-weight-bold mb-1 d-block">المدير المسؤول</label>
              <v-text-field
                v-model="formData.manager"
                variant="outlined"
                density="compact"
                placeholder="اسم المدير"
                rounded="lg"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="6">
              <label class="text-sm font-weight-bold mb-1 d-block">الحالة <span class="text-error">*</span></label>
              <v-select
                v-model="formData.status"
                :items="statuses"
                item-title="name"
                item-value="id"
                variant="outlined"
                density="compact"
                placeholder="اختر الحالة"
                rounded="lg"
                hide-details="auto"
                :error-messages="errors.status"
              />
            </v-col>

            <v-col cols="12" md="6">
              <label class="text-sm font-weight-bold mb-1 d-block">الوصف</label>
              <v-text-field
                v-model="formData.description"
                variant="outlined"
                density="compact"
                placeholder="وصف مختصر (اختياري)"
                rounded="lg"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />
        <v-card-actions class="pa-4 d-flex justify-end gap-3">
          <v-btn variant="text" color="grey" @click="closeForm">إلغاء</v-btn>
          <v-btn color="primary" variant="flat" rounded="lg" @click="handleSubmit">
            {{ editingItem ? 'حفظ التعديلات' : 'إضافة' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirm Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420">
      <v-card rounded="xl">
        <v-card-text class="pa-6 text-center">
          <v-icon size="56" color="error" class="mb-3">mdi-alert-circle-outline</v-icon>
          <div class="text-h6 font-weight-bold mb-2">تأكيد الحذف</div>
          <div class="text-medium-emphasis text-sm">
            هل أنت متأكد من حذف قسم "<strong>{{ deletingItem?.name }}</strong>"؟ لا يمكن التراجع عن هذا الإجراء.
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 d-flex justify-center gap-3">
          <v-btn variant="outlined" rounded="lg" @click="deleteDialog = false">إلغاء</v-btn>
          <v-btn color="error" variant="flat" rounded="lg" @click="handleDelete">حذف</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" location="top left" timeout="3000" rounded="lg">
      <v-icon class="me-2">{{ snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle' }}</v-icon>
      {{ snackbar.message }}
    </v-snackbar>

  </v-container>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

// ─── Static Data ───────────────────────────────────────────────────
const businessUnits = [
  { id: 1, name: 'وحدة الأعمال الرقمية' },
  { id: 2, name: 'وحدة العمليات' },
  { id: 3, name: 'وحدة خدمة العملاء' },
  { id: 4, name: 'وحدة التطوير' },
]

const statuses = [
  { id: 'active', name: 'نشط' },
  { id: 'inactive', name: 'غير نشط' },
]

const STORAGE_KEY = 'departments_data'

const defaultDepartments = [
  { id: 1, name: 'قسم تقنية المعلومات', code: 'IT-001', business_unit_id: 1, business_unit_name: 'وحدة الأعمال الرقمية', manager: 'أحمد محمد', status: 'active', description: '' },
  { id: 2, name: 'قسم الموارد البشرية', code: 'HR-001', business_unit_id: 2, business_unit_name: 'وحدة العمليات', manager: 'سارة علي', status: 'active', description: '' },
  { id: 3, name: 'قسم المالية', code: 'FIN-001', business_unit_id: 2, business_unit_name: 'وحدة العمليات', manager: 'خالد عمر', status: 'active', description: '' },
  { id: 4, name: 'قسم التسويق', code: 'MKT-001', business_unit_id: 3, business_unit_name: 'وحدة خدمة العملاء', manager: 'نورة سعد', status: 'inactive', description: '' },
  { id: 5, name: 'قسم المبيعات', code: 'SLS-001', business_unit_id: 3, business_unit_name: 'وحدة خدمة العملاء', manager: 'فيصل عبدالله', status: 'active', description: '' },
  { id: 6, name: 'قسم تطوير البرمجيات', code: 'DEV-001', business_unit_id: 4, business_unit_name: 'وحدة التطوير', manager: 'ريم ناصر', status: 'active', description: '' },
]

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : defaultDepartments
  } catch {
    return defaultDepartments
  }
}

const departments = ref(loadFromStorage())

let nextId = Math.max(...departments.value.map(d => d.id), 6) + 1

const saveToStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(departments.value))
}

// ─── Table ─────────────────────────────────────────────────────────
const headers = [
  { title: '#', key: 'id', align: 'center', width: '60px' },
  { title: 'اسم القسم', key: 'name' },
  { title: 'كود القسم', key: 'code' },
  { title: 'وحدة الأعمال', key: 'business_unit_name' },
  { title: 'المدير المسؤول', key: 'manager' },
  { title: 'الحالة', key: 'status', align: 'center' },
  { title: 'الإجراءات', key: 'actions', sortable: false, align: 'center' },
]

const search = ref('')

const filteredDepartments = computed(() => {
  if (!search.value) return departments.value
  const s = search.value.toLowerCase()
  return departments.value.filter(d =>
    d.name.toLowerCase().includes(s) ||
    d.code.toLowerCase().includes(s) ||
    d.business_unit_name.toLowerCase().includes(s) ||
    d.manager.toLowerCase().includes(s)
  )
})

// ─── Form State ────────────────────────────────────────────────────
const dialog = ref(false)
const editingItem = ref(null)
const errors = reactive({ name: '', code: '', business_unit_id: '', status: '' })

const formData = reactive({ name: '', code: '', business_unit_id: null, manager: '', status: null, description: '' })

const resetForm = () => {
  formData.name = ''
  formData.code = ''
  formData.business_unit_id = null
  formData.manager = ''
  formData.status = null
  formData.description = ''
  errors.name = ''
  errors.code = ''
  errors.business_unit_id = ''
  errors.status = ''
  editingItem.value = null
}

const validate = () => {
  let valid = true
  errors.name = formData.name ? '' : 'اسم القسم مطلوب'
  errors.code = formData.code ? '' : 'كود القسم مطلوب'
  errors.business_unit_id = formData.business_unit_id ? '' : 'وحدة الأعمال مطلوبة'
  errors.status = formData.status ? '' : 'الحالة مطلوبة'
  if (errors.name || errors.code || errors.business_unit_id || errors.status) valid = false
  return valid
}

const openForm = (item = null) => {
  resetForm()
  if (item) {
    editingItem.value = item
    formData.name = item.name
    formData.code = item.code
    formData.business_unit_id = item.business_unit_id
    formData.manager = item.manager
    formData.status = item.status
    formData.description = item.description || ''
  }
  dialog.value = true
}

const closeForm = () => {
  dialog.value = false
  resetForm()
}

const handleSubmit = () => {
  if (!validate()) return
  const bu = businessUnits.find(b => b.id === formData.business_unit_id)
  if (editingItem.value) {
    const idx = departments.value.findIndex(d => d.id === editingItem.value.id)
    if (idx !== -1) {
      departments.value[idx] = { ...departments.value[idx], ...formData, business_unit_name: bu?.name || '' }
    }
    showSnack('تم تعديل القسم بنجاح')
  } else {
    departments.value.push({ id: nextId++, ...formData, business_unit_name: bu?.name || '' })
    showSnack('تم إضافة القسم بنجاح')
  }
  saveToStorage()
  closeForm()
}

// ─── Delete ────────────────────────────────────────────────────────
const deleteDialog = ref(false)
const deletingItem = ref(null)

const confirmDelete = (item) => {
  deletingItem.value = item
  deleteDialog.value = true
}

const handleDelete = () => {
  departments.value = departments.value.filter(d => d.id !== deletingItem.value.id)
  saveToStorage()
  deleteDialog.value = false
  deletingItem.value = null
  showSnack('تم حذف القسم بنجاح', 'error')
}

// ─── Snackbar ──────────────────────────────────────────────────────
const snackbar = reactive({ show: false, message: '', color: 'success' })
const showSnack = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}
</script>

<style scoped>
.rtl-table :deep(table) {
  direction: rtl;
}
.rtl-table :deep(th) {
  text-align: right !important;
}
</style>
