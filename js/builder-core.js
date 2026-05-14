// 📦 State Management
const state = {
  photo: null,
  name: '',
  title: '',
  email: '',
  phone: '',
  address: '',
  linkedin: '',
  summary: '',
  education: [],
  experience: [],
  skills: ''
};

// 🎯 DOM Elements - Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  initializeBuilder();
});

function initializeBuilder() {
  const elements = {
    photoUpload: document.getElementById('photo-upload'),
    photoPreview: document.getElementById('photo-preview'),
    name: document.getElementById('name'),
    title: document.getElementById('title'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    address: document.getElementById('address'),
    linkedin: document.getElementById('linkedin'),
    summary: document.getElementById('summary'),
    skills: document.getElementById('skills'),
    eduSection: document.getElementById('edu-section'),
    expSection: document.getElementById('exp-section'),
    addEduBtn: document.getElementById('add-edu'),
    addExpBtn: document.getElementById('add-exp'),
    templateSelect: document.getElementById('template-select'),
    resumePreview: document.getElementById('resume-preview'),
    downloadPdfBtn: document.getElementById('download-pdf')
  };

  // 🖼️ Image Handler
  if(elements.photoUpload) {
    elements.photoUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if(file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          state.photo = ev.target.result;
          if(elements.photoPreview) {
            elements.photoPreview.style.backgroundImage = `url(${state.photo})`;
            elements.photoPreview.style.backgroundSize = 'cover';
            elements.photoPreview.style.backgroundPosition = 'center';
            elements.photoPreview.innerHTML = '';
          }
          renderPreview();
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // 📝 Text Input Listeners
  const textInputs = [
    { id: 'name', key: 'name' },
    { id: 'title', key: 'title' },
    { id: 'email', key: 'email' },
    { id: 'phone', key: 'phone' },
    { id: 'address', key: 'address' },
    { id: 'linkedin', key: 'linkedin' },
    { id: 'summary', key: 'summary' },
    { id: 'skills', key: 'skills' }
  ];

  textInputs.forEach(({ id, key }) => {
    const el = elements[key];
    if(el) {
      // Set initial value
      state[key] = el.value;
      // Add listener
      el.addEventListener('input', (e) => {
        state[key] = e.target.value;
        renderPreview();
      });
    }
  });

  // 🔄 Initialize Dynamic Sections
  initializeDynamicSections(elements);

  // 🎨 Template Change Listener
  if(elements.templateSelect) {
    elements.templateSelect.addEventListener('change', () => {
      renderPreview();
    });
  }

  // 📥 PDF Download
  if(elements.downloadPdfBtn) {
    elements.downloadPdfBtn.addEventListener('click', () => {
      downloadPDF(elements.resumePreview);
    });
  }

  // Initial Render
  renderPreview();
}

// 🔄 Dynamic Sections Setup
function initializeDynamicSections(elements) {
  // Education Section
  if(elements.eduSection && elements.addEduBtn) {
    attachRemoveListeners(elements.eduSection, 'education');
    
    elements.addEduBtn.addEventListener('click', () => {
      addDynamicEntry(elements.eduSection, 'edu-degree', 'edu-inst', 
        'Degree (e.g., BS CS)', 'Institution');
      attachRemoveListeners(elements.eduSection, 'education');
      collectEducationData(elements.eduSection);
    });
    collectEducationData(elements.eduSection);
  }

  // Experience Section
  if(elements.expSection && elements.addExpBtn) {
    attachRemoveListeners(elements.expSection, 'experience');
    
    elements.addExpBtn.addEventListener('click', () => {
      addDynamicEntry(elements.expSection, 'exp-role', 'exp-company',
        'Role (e.g., Software Engineer)', 'Company');
      attachRemoveListeners(elements.expSection, 'experience');
      collectExperienceData(elements.expSection);
    });
    collectExperienceData(elements.expSection);
  }
}

function addDynamicEntry(container, class1, class2, placeholder1, placeholder2) {
  const div = document.createElement('div');
  div.className = 'dynamic-entry';
  div.innerHTML = `
    <input type="text" class="${class1}" placeholder="${placeholder1}">
    <input type="text" class="${class2}" placeholder="${placeholder2}">
    <button type="button" class="btn-remove">✖</button>
  `;
  
  const addBtn = container.querySelector('.btn-add, #add-edu, #add-exp');
  if(addBtn) {
    container.insertBefore(div, addBtn);
  } else {
    container.appendChild(div);
  }
}

function attachRemoveListeners(container, type) {
  const removeBtns = container.querySelectorAll('.btn-remove');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('.dynamic-entry').remove();
      if(type === 'education') {
        collectEducationData(container);
      } else {
        collectExperienceData(container);
      }
    });
  });
}

function collectEducationData(container) {
  const entries = [];
  const dynamicEntries = container.querySelectorAll('.dynamic-entry');
  
  dynamicEntries.forEach(div => {
    const input1 = div.querySelector('.edu-degree');
    const input2 = div.querySelector('.edu-inst');
    const val1 = input1 ? input1.value.trim() : '';
    const val2 = input2 ? input2.value.trim() : '';
    
    if(val1 || val2) {
      entries.push({ first: val1, second: val2 });
    }
  });
  
  state.education = entries;
  renderPreview();
}

function collectExperienceData(container) {
  const entries = [];
  const dynamicEntries = container.querySelectorAll('.dynamic-entry');
  
  dynamicEntries.forEach(div => {
    const input1 = div.querySelector('.exp-role');
    const input2 = div.querySelector('.exp-company');
    const val1 = input1 ? input1.value.trim() : '';
    const val2 = input2 ? input2.value.trim() : '';
    
    if(val1 || val2) {
      entries.push({ first: val1, second: val2 });
    }
  });
  
  state.experience = entries;
  renderPreview();
}

// 📇 Contact Info Helper - FUNCTION BANAYEN
const getContactInfo = () => `
  <div class="contact-info-container" style="display: flex; flex-wrap: wrap; gap: 0.8rem 1.5rem; justify-content: center; align-items: center; margin: 0.8rem 0 1.5rem; color: #64748b; font-size: 0.9rem;">
    ${state.email ? `<span>📧 ${state.email}</span>` : ''}
    ${state.phone ? `<span>📱 ${state.phone}</span>` : ''}
    ${state.address ? `<span>📍 ${state.address}</span>` : ''}
    ${state.linkedin ? `<span>🔗 ${state.linkedin}</span>` : ''}
  </div>
`;

// 🎨 Template Rendering Functions
const templates = {
  1: () => renderTemplate1(),
  2: () => renderTemplate2(),
  3: () => renderTemplate3(),
  4: () => renderTemplate4(),
  5: () => renderTemplate5(),
  6: () => renderTemplate6()
};

// Template 1: Classic
function renderTemplate1() {
  return `
    <div class="resume-template-1" style="font-family: Georgia, serif;">
      <div style="text-align: center; border-bottom: 3px solid #6366f1; padding-bottom: 1.5rem; margin-bottom: 2rem;">
        ${state.photo ? `<img src="${state.photo}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem; border: 3px solid #6366f1;">` : ''}
        <h1 style="font-size: 2rem; color: #0f172a; margin: 0.5rem 0; font-weight: 700;">${state.name || 'Your Name'}</h1>
        <p style="font-size: 1.1rem; color: #64748b; margin: 0;">${state.title || 'Professional Title'}</p>
        ${getContactInfo()}
      </div>
      
      ${state.summary ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem;">Summary</h3>
        <p style="color: #475569; line-height: 1.6;">${state.summary}</p>
      </div>
      ` : ''}
      
      ${state.education.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem;">Education</h3>
        ${state.education.map(edu => `
          <div style="margin-bottom: 0.8rem;">
            <strong style="display: block; color: #0f172a; font-size: 1rem;">${edu.first}</strong>
            <span style="color: #64748b; font-size: 0.95rem;">${edu.second}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.experience.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem;">Experience</h3>
        ${state.experience.map(exp => `
          <div style="margin-bottom: 0.8rem;">
            <strong style="display: block; color: #0f172a; font-size: 1rem;">${exp.first}</strong>
            <span style="color: #64748b; font-size: 0.95rem;">${exp.second}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.skills ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; color: #6366f1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.8rem; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3rem;">Skills</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${state.skills.split(',').filter(s => s.trim()).map(skill => `
            <span style="background: #e0e7ff; color: #3730a3; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem;">${skill.trim()}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

// Template 2: Modern
function renderTemplate2() {
  return `
    <div class="resume-template-2" style="font-family: Arial, sans-serif;">
      <div style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.5rem; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 2rem; border-radius: 12px;">
        ${state.photo ? `<img src="${state.photo}" style="width: 80px; height: 80px; border-radius: 12px; object-fit: cover; border: 3px solid white;">` : '<div style="width: 80px; height: 80px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">👤</div>'}
        <div>
          <h1 style="margin: 0; font-size: 1.8rem; font-weight: 700;">${state.name || 'Your Name'}</h1>
          <p style="margin: 0.3rem 0 0; opacity: 0.9; font-size: 1rem;">${state.title || 'Professional Title'}</p>
        </div>
      </div>
      ${getContactInfo()}
      
      ${state.summary ? `<p style="margin-bottom: 1.5rem; color: #475569; line-height: 1.6;">${state.summary}</p>` : ''}
      
      ${state.education.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 8px; color: #0f172a; margin-bottom: 1rem; font-size: 0.95rem; font-weight: 600;">Education</h3>
        ${state.education.map(edu => `<p style="margin: 0.4rem 0;"><strong>${edu.first}</strong> • ${edu.second}</p>`).join('')}
      </div>
      ` : ''}
      
      ${state.experience.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 8px; color: #0f172a; margin-bottom: 1rem; font-size: 0.95rem; font-weight: 600;">Experience</h3>
        ${state.experience.map(exp => `<p style="margin: 0.4rem 0;"><strong>${exp.first}</strong> • ${exp.second}</p>`).join('')}
      </div>
      ` : ''}
      
      ${state.skills ? `
      <div>
        <h3 style="background: #f1f5f9; padding: 0.6rem 1rem; border-radius: 8px; color: #0f172a; margin-bottom: 1rem; font-size: 0.95rem; font-weight: 600;">Skills</h3>
        <p style="color: #475569;">${state.skills}</p>
      </div>
      ` : ''}
    </div>
  `;
}

// Template 3: Minimal
function renderTemplate3() {
  return `
    <div class="resume-template-3" style="font-family: Helvetica, Arial, sans-serif;">
      <div style="margin-bottom: 2rem; text-align: center;">
        <h1 style="font-size: 3rem; font-weight: 300; letter-spacing: 3px; margin-bottom: 0.3rem; color: #0f172a;">${state.name || 'Your Name'}</h1>
        <p style="font-size: 1rem; color: #94a3b8; letter-spacing: 2px;">${state.title || 'Professional Title'}</p>
        ${getContactInfo()}
      </div>
      
      ${state.summary ? `
      <div style="margin-bottom: 2rem; padding-left: 2rem; border-left: 2px solid #6366f1;">
        <p style="color: #475569; line-height: 1.6;">${state.summary}</p>
      </div>
      ` : ''}
      
      ${state.education.length > 0 ? `
      <div style="margin-bottom: 2rem; padding-left: 2rem; border-left: 2px solid #6366f1;">
        <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: #6366f1; margin-bottom: 1rem;">Education</h3>
        ${state.education.map(edu => `
          <div style="margin-bottom: 0.8rem;">
            <div style="font-weight: 600; color: #0f172a;">${edu.first}</div>
            <div style="color: #64748b; font-size: 0.9rem;">${edu.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.experience.length > 0 ? `
      <div style="margin-bottom: 2rem; padding-left: 2rem; border-left: 2px solid #6366f1;">
        <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: #6366f1; margin-bottom: 1rem;">Experience</h3>
        ${state.experience.map(exp => `
          <div style="margin-bottom: 0.8rem;">
            <div style="font-weight: 600; color: #0f172a;">${exp.first}</div>
            <div style="color: #64748b; font-size: 0.9rem;">${exp.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.skills ? `
      <div style="padding-left: 2rem; border-left: 2px solid #6366f1;">
        <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 2px; color: #6366f1; margin-bottom: 1rem;">Skills</h3>
        <p style="color: #475569;">${state.skills}</p>
      </div>
      ` : ''}
    </div>
  `;
}

// Template 4: Creative
function renderTemplate4() {
  return `
    <div class="resume-template-4" style="font-family: 'Comic Sans MS', cursive, sans-serif;">
      <div style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; padding: 2rem; border-radius: 15px; margin-bottom: 2rem; text-align: center;">
        ${state.photo ? `<img src="${state.photo}" style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; border: 4px solid white; margin-bottom: 1rem;">` : ''}
        <h1 style="font-size: 2.2rem; margin: 0.5rem 0; font-weight: 700;">${state.name || 'Your Name'}</h1>
        <p style="font-size: 1.1rem; opacity: 0.95;">${state.title || 'Professional Title'}</p>
      </div>
      ${getContactInfo()}
      
      ${state.summary ? `
      <div style="background: #fef3c7; padding: 1.2rem; border-radius: 10px; margin-bottom: 1.5rem; border-left: 4px solid #f59e0b;">
        <h3 style="color: #d97706; margin-bottom: 0.5rem; font-size: 1rem;">About Me</h3>
        <p style="color: #92400e; line-height: 1.6;">${state.summary}</p>
      </div>
      ` : ''}
      
      ${state.education.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="background: #ddd6fe; padding: 0.7rem 1rem; border-radius: 10px; color: #7c3aed; margin-bottom: 1rem; font-size: 1rem;">🎓 Education</h3>
        ${state.education.map(edu => `
          <div style="background: #f3f4f6; padding: 0.8rem; margin-bottom: 0.5rem; border-radius: 8px;">
            <div style="font-weight: 600; color: #0f172a;">${edu.first}</div>
            <div style="color: #64748b; font-size: 0.9rem;">${edu.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.experience.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="background: #ddd6fe; padding: 0.7rem 1rem; border-radius: 10px; color: #7c3aed; margin-bottom: 1rem; font-size: 1rem;">💼 Experience</h3>
        ${state.experience.map(exp => `
          <div style="background: #f3f4f6; padding: 0.8rem; margin-bottom: 0.5rem; border-radius: 8px;">
            <div style="font-weight: 600; color: #0f172a;">${exp.first}</div>
            <div style="color: #64748b; font-size: 0.9rem;">${exp.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.skills ? `
      <div>
        <h3 style="background: #ddd6fe; padding: 0.7rem 1rem; border-radius: 10px; color: #7c3aed; margin-bottom: 1rem; font-size: 1rem;">🎨 Skills</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${state.skills.split(',').filter(s => s.trim()).map(skill => `
            <span style="background: linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%); color: white; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.85rem; font-weight: 500;">${skill.trim()}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  `;
}

// Template 5: Executive
function renderTemplate5() {
  return `
    <div class="resume-template-5" style="font-family: 'Times New Roman', serif;">
      <div style="border-bottom: 4px solid #0f172a; padding-bottom: 1.5rem; margin-bottom: 2rem;">
        <h1 style="font-size: 2.5rem; color: #0f172a; margin: 0; font-weight: 700; letter-spacing: 1px;">${state.name || 'Your Name'}</h1>
        <p style="font-size: 1.2rem; color: #475569; margin: 0.5rem 0 0; font-style: italic;">${state.title || 'Professional Title'}</p>
        ${getContactInfo()}
      </div>
      
      ${state.summary ? `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1.1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 0.8rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.3rem;">Executive Summary</h3>
        <p style="color: #475569; line-height: 1.8; text-align: justify;">${state.summary}</p>
      </div>
      ` : ''}
      
      ${state.education.length > 0 ? `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1.1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 1rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.3rem;">Education</h3>
        ${state.education.map(edu => `
          <div style="margin-bottom: 1rem;">
            <div style="font-weight: 700; color: #0f172a; font-size: 1.05rem;">${edu.first}</div>
            <div style="color: #64748b;">${edu.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.experience.length > 0 ? `
      <div style="margin-bottom: 2rem;">
        <h3 style="font-size: 1.1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 1rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.3rem;">Professional Experience</h3>
        ${state.experience.map(exp => `
          <div style="margin-bottom: 1rem;">
            <div style="font-weight: 700; color: #0f172a; font-size: 1.05rem;">${exp.first}</div>
            <div style="color: #64748b;">${exp.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.skills ? `
      <div>
        <h3 style="font-size: 1.1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 1rem; border-bottom: 2px solid #0f172a; padding-bottom: 0.3rem;">Core Competencies</h3>
        <p style="color: #475569; line-height: 1.8;">${state.skills}</p>
      </div>
      ` : ''}
    </div>
  `;
}

// Template 6: ATS Pro
function renderTemplate6() {
  return `
    <div class="resume-template-6" style="font-family: Calibri, Arial, sans-serif;">
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <h1 style="font-size: 2rem; color: #0f172a; margin: 0.5rem 0; font-weight: 700;">${state.name || 'Your Name'}</h1>
        <p style="font-size: 1.1rem; color: #64748b; margin: 0;">${state.title || 'Professional Title'}</p>
        ${getContactInfo()}
      </div>
      
      ${state.summary ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 0.5rem; font-weight: 700;">Professional Summary</h3>
        <p style="color: #475569; line-height: 1.6;">${state.summary}</p>
      </div>
      ` : ''}
      
      ${state.education.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 0.8rem; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.3rem;">Education</h3>
        ${state.education.map(edu => `
          <div style="margin-bottom: 0.6rem;">
            <div style="font-weight: 600; color: #0f172a;">${edu.first}</div>
            <div style="color: #64748b; font-size: 0.95rem;">${edu.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.experience.length > 0 ? `
      <div style="margin-bottom: 1.5rem;">
        <h3 style="font-size: 1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 0.8rem; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.3rem;">Work Experience</h3>
        ${state.experience.map(exp => `
          <div style="margin-bottom: 0.6rem;">
            <div style="font-weight: 600; color: #0f172a;">${exp.first}</div>
            <div style="color: #64748b; font-size: 0.95rem;">${exp.second}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${state.skills ? `
      <div>
        <h3 style="font-size: 1rem; color: #0f172a; text-transform: uppercase; margin-bottom: 0.8rem; font-weight: 700; border-bottom: 1px solid #cbd5e1; padding-bottom: 0.3rem;">Skills</h3>
        <p style="color: #475569; line-height: 1.6;">${state.skills}</p>
      </div>
      ` : ''}
    </div>
  `;
}

// Render Preview Function
function renderPreview() {
  const previewEl = document.getElementById('resume-preview');
  const templateSelect = document.getElementById('template-select');
  
  if(!previewEl) return;
  
  const templateId = templateSelect ? templateSelect.value : '1';
  const templateRenderer = templates[templateId];
  
  if(templateRenderer) {
    previewEl.innerHTML = templateRenderer();
  } else {
    previewEl.innerHTML = templates['1']();
  }
}

// PDF Download Function
function downloadPDF(element) {
  if(!element) {
    alert('Preview not found!');
    return;
  }
  
  const opt = {
    margin: 0,
    filename: `${state.name.replace(/\s+/g, '_') || 'Resume'}_CV.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  
  if(typeof html2pdf !== 'undefined') {
    html2pdf().set(opt).from(element).save();
  } else {
    alert('PDF library not loaded! Please check your internet connection.');
  }
}