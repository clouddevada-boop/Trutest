import React from 'react';
import {
  ReportFormData,
  formatFullPatientName,
  formatReportDateTime,
  getGenderLabel,
} from '../types/report';

interface ReportHeaderProps {
  data: ReportFormData;
  sampleId: string;
}

const REPORT_FONT_FAMILY = 'Arial, Helvetica, "Liberation Sans", sans-serif';

function ReportHeader({data, sampleId}: ReportHeaderProps) {
  const fullName = formatFullPatientName(data.salutation, data.patientName);
  const genderLabel = getGenderLabel(data.salutation);
  const ageText = data.age.trim() ? `${data.age.trim()} Yrs` : '— Yrs';

  return (
    <div>
      {/* Top Banner & Brand Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '12px',
        }}
      >
        <div
          style={{
            backgroundColor: '#1E4C9A',
            color: '#FFFFFF',
            fontSize: '13.5px',
            fontWeight: 500,
            padding: '5px 12px',
            letterSpacing: '0.02em',
            marginTop: '6px',
          }}
        >
          LABORATORY TEST REPORT
        </div>

        <div style={{textAlign: 'right', lineHeight: 1}}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
            }}
          >
            <span style={{color: '#17B5A3'}}>TRU</span>
            <span style={{color: '#1E4C9A'}}>test</span>
          </div>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 500,
              letterSpacing: '0.42em',
              color: '#000000',
              marginTop: '5px',
              marginRight: '-0.42em',
              textAlign: 'center',
            }}
          >
            DIAGNOSTICS
          </div>
        </div>
      </div>

      {/* Patient & Sample Metadata */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          fontSize: '12px',
          lineHeight: '1.68',
          color: '#000000',
          marginBottom: '8px',
        }}
      >
        {/* Left Metadata Column */}
        <div style={{width: '54%'}}>
          <div style={{display: 'flex'}}>
            <span style={{width: '88px', flexShrink: 0}}>Name</span>
            <span style={{fontWeight: 400}}>{fullName}</span>
          </div>
          <div style={{display: 'flex'}}>
            <span style={{width: '88px', flexShrink: 0}}>Age/Gender</span>
            <span style={{marginLeft: '4px'}}>: {ageText} / {genderLabel}</span>
          </div>
          <div style={{display: 'flex'}}>
            <span style={{width: '88px', flexShrink: 0}}>Sample ID</span>
            <span style={{marginLeft: '4px'}}>: {sampleId}</span>
          </div>
          <div style={{display: 'flex'}}>
            <span style={{width: '88px', flexShrink: 0}}>Client Name</span>
            <span style={{marginLeft: '4px'}}>: {data.clientName}</span>
          </div>
        </div>

        {/* Right Metadata Column */}
        <div style={{width: '41%', paddingTop: '6px'}}>
          <div style={{display: 'flex'}}>
            <span style={{width: '78px', flexShrink: 0}}>Ref. Doctor</span>
            <span>: {data.refDoctor}</span>
          </div>
          <div style={{display: 'flex'}}>
            <span style={{width: '78px', flexShrink: 0}}>Collected</span>
            <span>: {formatReportDateTime(data.collected)}</span>
          </div>
          <div style={{display: 'flex'}}>
            <span style={{width: '78px', flexShrink: 0}}>Received</span>
            <span>: {formatReportDateTime(data.received)}</span>
          </div>
          <div style={{display: 'flex'}}>
            <span style={{width: '78px', flexShrink: 0}}>Reported</span>
            <span>: {formatReportDateTime(data.reported)}</span>
          </div>
        </div>
      </div>

      {/* Department Banner */}
      <div style={{borderTop: '1.2px solid #222222', borderBottom: '1.2px solid #222222'}}>
        <div
          style={{
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#000000',
            padding: '5px 0',
            letterSpacing: '0.01em',
          }}
        >
          DEPARTMENT OF IMMUNOLOGY / SEROLOGY
        </div>
      </div>
    </div>
  );
}

function ReportFooter({pageNumber}: {pageNumber: 1 | 2 | 3}) {
  return (
    <div style={{marginTop: 'auto'}}>
      {/* Signature + Page Indicator Row */}
      <div
        style={{
          padding: '0 40px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '6px',
        }}
      >
        <div style={{width: '150px'}} />

        <div
          style={{
            fontSize: '11.5px',
            color: '#000000',
            paddingBottom: '4px',
          }}
        >
          Page {pageNumber} of 3
        </div>

        <div style={{width: '150px', textAlign: 'left', paddingLeft: '14px'}}>
          {/* Doctor Signature Image */}
          <div
            style={{
              width: '96px',
              height: '61px',
              overflow: 'hidden',
              marginLeft: '-16px',
              marginBottom: '1px',
            }}
          >
            <img
              src="/assets/aistudio/image_56bd29ca.png"
              alt="Dr. Raju Bhaisare Signature"
              style={{
                display: 'block',
                width: '96px',
                height: '65px',
                objectFit: 'fill',
              }}
            />
          </div>
          <div style={{fontSize: '12.5px', color: '#000000', lineHeight: 1.25}}>
            Dr. Raju Bhaisare
          </div>
          <div style={{fontSize: '12.5px', color: '#000000', lineHeight: 1.25}}>
            MD Pathology
          </div>
        </div>
      </div>

      {/* Split Teal / Blue Horizontal Accent Bar */}
      <div style={{display: 'flex', width: '100%', height: '5px'}}>
        <div style={{width: '30.5%', backgroundColor: '#19B8A5'}} />
        <div style={{width: '69.5%', backgroundColor: '#1E4C9A'}} />
      </div>

      {/* Center Address */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '10px 24px 14px',
          fontSize: '15px',
          color: '#000000',
          letterSpacing: '0.005em',
        }}
      >
        <svg
          width="15"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{flexShrink: 0}}
        >
          <path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
            stroke="#22A89C"
            strokeWidth="1.8"
            fill="#E6F7F5"
          />
          <circle cx="12" cy="9" r="2.6" stroke="#1E4C9A" strokeWidth="1.6" fill="#FFFFFF" />
        </svg>
        <span>
          Shop No. 7B/189, Ground Floor Smriti Nagar, Durg, Bhilai, Durg – 491001, Chhattisgarh
        </span>
      </div>
    </div>
  );
}

const pageShellStyle: React.CSSProperties = {
  width: '794px',
  height: '1123px',
  backgroundColor: '#FFFFFF',
  color: '#000000',
  fontFamily: REPORT_FONT_FAMILY,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  position: 'relative',
  overflow: 'hidden',
};

const tableHeaderRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '37% 21% 12% 30%',
  fontSize: '12px',
  fontWeight: 700,
  color: '#000000',
  marginBottom: '6px',
};

const tableValueRowStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '37% 21% 12% 30%',
  fontSize: '12px',
  color: '#000000',
  alignItems: 'start',
};

interface SinglePageProps {
  data: ReportFormData;
  pageRef?: React.Ref<HTMLDivElement>;
}

export function Page1Serology({data, pageRef}: SinglePageProps) {
  return (
    <div ref={pageRef} style={pageShellStyle} className="a4-print-page">
      <div style={{padding: '18px 40px 0 40px', flex: 1}}>
        <ReportHeader data={data} sampleId={data.sampleIdMain} />

        {/* Section 1: Hepatitis B */}
        <div style={{marginTop: '10px'}}>
          <div style={{fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '7px'}}>
            Hepatitis B Surface antigen (HBsAg )Rapid{' '}
            <span style={{fontWeight: 400, fontStyle: 'italic', fontSize: '12.5px'}}>(Serum)</span>
          </div>

          <div style={tableHeaderRowStyle}>
            <div>TEST DESCRIPTION</div>
            <div>RESULT</div>
            <div>UNITS</div>
            <div>BIOLOGICAL REFERENCE INTERVAL</div>
          </div>

          <div style={tableValueRowStyle}>
            <div style={{lineHeight: 1.35}}>
              <div>Hepatitis B Surface antigen (HBsAg)</div>
              <div>Rapid</div>
              <div style={{fontSize: '9px', color: '#222222', marginTop: '2px'}}>
                Method :- Immunochromatography
              </div>
            </div>
            <div style={{display: 'flex', gap: '16px'}}>
              <span style={{marginLeft: '-14px'}}>:</span>
              <span>{data.hepatitisB}</span>
            </div>
            <div />
            <div>Non Reactive</div>
          </div>
        </div>

        {/* Section 2: HIV 1 & 2 */}
        <div style={{marginTop: '28px'}}>
          <div style={{fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '7px'}}>
            HIV 1 &amp; 2 ANTIBODY (RAPID){' '}
            <span style={{fontWeight: 400, fontStyle: 'italic', fontSize: '12.5px'}}>(Serum)</span>
          </div>

          <div style={tableHeaderRowStyle}>
            <div>TEST DESCRIPTION</div>
            <div>RESULT</div>
            <div>UNITS</div>
            <div>BIOLOGICAL REFERENCE INTERVAL</div>
          </div>

          <div style={tableValueRowStyle}>
            <div style={{lineHeight: 1.35}}>
              <div>HIV 1 &amp; 2 Antibody (Rapid)</div>
              <div style={{fontSize: '9px', color: '#222222', marginTop: '2px'}}>
                Method :- Immunochromatography
              </div>
            </div>
            <div style={{display: 'flex', gap: '16px'}}>
              <span style={{marginLeft: '-14px'}}>:</span>
              <span>{data.hiv}</span>
            </div>
            <div />
            <div />
          </div>

          {/* Interpretation & Remarks */}
          <div style={{marginTop: '14px', fontSize: '10.2px', lineHeight: 1.5, color: '#000000'}}>
            <div style={{textDecoration: 'underline', marginBottom: '6px'}}>Interpretation :</div>
            <div style={{marginBottom: '6px'}}>Interpretation &amp; Remarks:</div>
            <ul style={{margin: '0 0 8px 0', paddingLeft: '14px', listStyleType: 'disc'}}>
              <li style={{marginBottom: '5px'}}>
                Kindly confirm all reactive results by ELISA and Western Blot method or virus detection by PCR.
              </li>
              <li style={{marginBottom: '5px'}}>
                Non-reactive result does not rule out the possibility of exposure to or infection with HIV.
              </li>
              <li style={{marginBottom: '5px'}}>
                This is a single screening test with limitations and instances of false positivity or false negativity cannot be ruled out.
              </li>
              <li style={{marginBottom: '5px'}}>
                In case of reactive results, final diagnosis of HIV to be done by following WHO strategy III.
              </li>
              <li style={{marginBottom: '5px'}}>
                It is beyond the scope of this laboratory to follow the strategy unless patient co-operates economically and with more number of samples.
              </li>
              <li style={{marginBottom: '5px'}}>
                The patient is advised to go to his/her referring doctor for counselling with test results.
              </li>
              <li style={{marginBottom: '5px'}}>
                The patient is also advised to go to NACO/MDAC counselling centers.
              </li>
            </ul>

            <div style={{marginBottom: '6px'}}>Interfering Substances:</div>
            <ul style={{margin: '0', paddingLeft: '14px', listStyleType: 'disc'}}>
              <li style={{marginBottom: '5px'}}>
                False positive can occur in patient who have autoimmune disease, lymphoproliferative disease, leukemia, lymphoma, syphilis, or alcoholism.
              </li>
              <li style={{marginBottom: '5px'}}>
                False positive results can occur in non-infected pregnant woman.
              </li>
              <li style={{marginBottom: '5px'}}>
                HIV-2 infection can cause positive HIV-1/ HIV-2 screening antibody test and an indeterminate WB HIV-1 confirmatory test.
              </li>
              <li style={{marginBottom: '5px'}}>
                False negative results can occur in the early incubation stage or final stage of AIDS.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Hepatitis C */}
        <div style={{marginTop: '34px'}}>
          <div style={{fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '7px'}}>
            Hepatitis C Virus (Rapid){' '}
            <span style={{fontWeight: 400, fontStyle: 'italic', fontSize: '12.5px'}}>(Serum)</span>
          </div>

          <div style={tableHeaderRowStyle}>
            <div>TEST DESCRIPTION</div>
            <div>RESULT</div>
            <div>UNITS</div>
            <div>BIOLOGICAL REFERENCE INTERVAL</div>
          </div>

          <div style={tableValueRowStyle}>
            <div>Hepatitis C Virus (Rapid)</div>
            <div style={{display: 'flex', gap: '16px'}}>
              <span style={{marginLeft: '-14px'}}>:</span>
              <span>{data.hepatitisC}</span>
            </div>
            <div />
            <div />
          </div>
        </div>
      </div>

      <ReportFooter pageNumber={1} />
    </div>
  );
}

export function Page2FastingGlucose({data, pageRef}: SinglePageProps) {
  const fastingValue = data.glucoseFasting.trim() || '—';

  const tableRows: [string, string][] = [
    ['Diabetes Mellitus', 'Pancreatic disorders'],
    ['Stress (e.g.: emotion, burns ,shock, anesthesia)', 'Extra pancreatic tumors'],
    ['Acute Pancreatitis', 'Endocrine disorders'],
    ['Chronic Pancreatitis', 'Malnutrition'],
    ['Wernicke encephalopathy (Vitamin B1 deficiency)', 'Hypothalamic lesions'],
    ['Effect of Drugs (e.g.: Corticosteroids, estrogens,alcohol, phenytoin, thiazides)', 'Alcoholism'],
  ];

  return (
    <div ref={pageRef} style={pageShellStyle} className="a4-print-page">
      <div style={{padding: '18px 40px 0 40px', flex: 1}}>
        <ReportHeader data={data} sampleId={data.sampleIdMain} />

        {/* Centered Biochemistry Header */}
        <div
          style={{
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: '#000000',
            padding: '10px 0 4px 0',
            borderBottom: '1.2px solid #222222',
          }}
        >
          DEPARTMENT OF CLINICAL BIOCHEMISTRY
        </div>

        {/* Glucose Fasting Section */}
        <div style={{marginTop: '6px'}}>
          <div style={{fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '7px'}}>
            Glucose Fasting{' '}
            <span style={{fontWeight: 400, fontStyle: 'italic', fontSize: '12.5px'}}>
              (Plasma Na [F])
            </span>
          </div>

          <div style={tableHeaderRowStyle}>
            <div>TEST DESCRIPTION</div>
            <div>RESULT</div>
            <div>UNITS</div>
            <div>BIOLOGICAL REFERENCE INTERVAL</div>
          </div>

          <div style={{...tableValueRowStyle, alignItems: 'start'}}>
            <div style={{fontWeight: 700}}>Glucose - Fasting</div>
            <div style={{display: 'flex', gap: '20px', fontWeight: 700}}>
              <span style={{marginLeft: '-22px', fontWeight: 400}}>:</span>
              <span>{fastingValue}</span>
            </div>
            <div style={{fontWeight: 700}}>mg/dL</div>
            <div style={{lineHeight: 1.35}}>
              <div>Normal : 70-100</div>
              <div>Impaired fasting glucose : 101-125</div>
              <div>Diabetes Mellitus : ≥126</div>
            </div>
          </div>
        </div>

        {/* Interpretation Gradient Scale */}
        <div style={{marginTop: '10px'}}>
          <div style={{fontSize: '10.5px', color: '#000000', marginBottom: '12px'}}>
            Interpretation
          </div>

          {/* Row 1: Category Bars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '26px',
              padding: '0 10px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #85E07F 0%, #5BC55D 35%, #32A432 70%, #1B931B 100%)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#000000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              Normal Glucose
            </div>
            <div
              style={{
                background: 'linear-gradient(90deg, #FFD175 0%, #FFC24D 35%, #FFB42A 70%, #FFAE18 100%)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#000000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              Impaired fasting glucose
            </div>
            <div
              style={{
                background: 'linear-gradient(90deg, #FFB7B4 0%, #FF8585 35%, #FE5655 70%, #FE3535 100%)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#000000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              Diabetes Mellitus
            </div>
          </div>

          {/* Row 2: Range Bars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '26px',
              padding: '0 10px',
              marginBottom: '30px',
            }}
          >
            <div
              style={{
                background: 'linear-gradient(90deg, #85E07F 0%, #5BC55D 35%, #32A432 70%, #1B931B 100%)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#000000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              70 - 100
            </div>
            <div
              style={{
                background: 'linear-gradient(90deg, #FFD175 0%, #FFC24D 35%, #FFB42A 70%, #FFAE18 100%)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#000000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              101 - 125
            </div>
            <div
              style={{
                background: 'linear-gradient(90deg, #FFB7B4 0%, #FF8585 35%, #FE5655 70%, #FE3535 100%)',
                borderRadius: '6px',
                padding: '7px 14px',
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#000000',
                boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
              }}
            >
              &gt;= 126
            </div>
          </div>
        </div>

        {/* Explanatory Text & Clinical Table */}
        <p style={{fontSize: '10px', lineHeight: 1.55, color: '#000000', margin: '0 0 8px 0'}}>
          Glucose is a primary cellular energy source. Fasting plasma glucose concentration and tolerance to a dose of glucose are used to establish the diagnosis of diabetes mellitus and disorders of carbohydrate metabolism.
        </p>

        <table
          style={{
            width: '96%',
            borderCollapse: 'collapse',
            fontSize: '10px',
            color: '#000000',
            marginBottom: '24px',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  border: '1px solid #9CA3AF',
                  padding: '6px 8px',
                  fontWeight: 400,
                  textAlign: 'center',
                  width: '51%',
                }}
              >
                Increased in
              </th>
              <th
                style={{
                  border: '1px solid #9CA3AF',
                  padding: '6px 8px',
                  fontWeight: 400,
                  textAlign: 'center',
                  width: '49%',
                }}
              >
                Decreased In
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(([inc, dec], idx) => (
              <tr key={idx}>
                <td
                  style={{
                    border: '1px solid #9CA3AF',
                    padding: '6px 6px 8px 6px',
                    verticalAlign: 'top',
                  }}
                >
                  {inc}
                </td>
                <td
                  style={{
                    border: '1px solid #9CA3AF',
                    padding: '6px 6px 8px 6px',
                    verticalAlign: 'top',
                  }}
                >
                  {dec}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Limitations & Associated Tests */}
        <div style={{fontSize: '10px', lineHeight: 1.65, color: '#000000'}}>
          <div style={{marginBottom: '3px'}}>Limitations</div>
          <div style={{marginBottom: '3px'}}>
            · Glucose levels may be affected by recent food intake, fasting duration, stress, exercise, acute illness, or certain medications such as steroids and antidiabetic drugs.
          </div>
          <div style={{marginBottom: '3px'}}>
            · Delayed sample processing may lead to falsely low glucose values due to ongoing glucose consumption by blood cells.
          </div>
          <div style={{marginBottom: '7px'}}>
            · Hemolysis, improper sample handling, or incorrect patient preparation may influence test accuracy.
          </div>

          <div style={{marginBottom: '3px'}}>Associated Tests</div>
          <div>
            · Additional tests such as HbA1c, Oral Glucose Tolerance Test (OGTT), Insulin Levels, C-Peptide, and Urine Glucose may help in further evaluation of glucose
          </div>
        </div>
      </div>

      <ReportFooter pageNumber={2} />
    </div>
  );
}

export function Page3PostprandialGlucose({data, pageRef}: SinglePageProps) {
  const ppValue = data.glucosePostprandial.trim() || '—';

  const tableRows: [string, string][] = [
    ['Diabetes Mellitus', 'Pancreatic Disorders'],
    ['Stress (E.G.: Emotion, Burns, Shock, Anesthesia)', 'Extra Pancreatic Tumors'],
    ['Acute Pancreatitis', 'Endocrine Disorders'],
    ['Chronic Pancreatitis', 'Malnutrition'],
    ['Wernicke Encephalopathy (Vitamin B1 Deficiency)', 'Hypothalamic Lesions'],
    ['Effect Of Drugs (E.G.: Corticosteroids, Estrogens, Alcohol, Phenytoin, Thiazides)', 'Alcoholism'],
  ];

  return (
    <div ref={pageRef} style={pageShellStyle} className="a4-print-page">
      <div style={{padding: '18px 40px 0 40px', flex: 1}}>
        <ReportHeader data={data} sampleId={data.sampleIdPostprandial} />

        {/* Glucose Postprandial Section */}
        <div style={{marginTop: '10px'}}>
          <div style={{fontSize: '14px', fontWeight: 700, color: '#000000', marginBottom: '8px'}}>
            Glucose - Postprandial{' '}
            <span style={{fontWeight: 400, fontStyle: 'italic', fontSize: '12.5px'}}>
              (Plasma Na [PP])
            </span>
          </div>

          <div style={tableHeaderRowStyle}>
            <div>TEST DESCRIPTION</div>
            <div>RESULT</div>
            <div>UNITS</div>
            <div>BIOLOGICAL REFERENCE INTERVAL</div>
          </div>

          <div style={{...tableValueRowStyle, alignItems: 'start'}}>
            <div style={{lineHeight: 1.35}}>
              <div style={{fontWeight: 700}}>Glucose - Postprandial</div>
              <div style={{fontSize: '9px', color: '#222222', marginTop: '3px'}}>
                Method :- GOD-POD
              </div>
            </div>
            <div style={{display: 'flex', gap: '20px', fontWeight: 700}}>
              <span style={{marginLeft: '-22px', fontWeight: 400}}>:</span>
              <span>{ppValue}</span>
            </div>
            <div style={{fontWeight: 700}}>mg/dL</div>
            <div style={{fontWeight: 700}}>70-140</div>
          </div>
        </div>

        {/* Interpretation */}
        <div style={{marginTop: '14px', fontSize: '9.5px', lineHeight: 1.5, color: '#000000'}}>
          <div style={{marginBottom: '2px'}}>Interpretation</div>
          <div style={{paddingLeft: '14px', marginBottom: '6px'}}>
            · Blood glucose testing helps detect hyperglycemia and hypoglycemia, screen individuals at risk for diabetes before symptoms appear, aid in the diagnosis of diabetes, prediabetes, and gestational diabetes, and monitor glucose levels in patients already diagnosed with diabetes.
          </div>

          {/* 2-Column Bordered Table */}
          <table
            style={{
              width: '96%',
              marginLeft: '12px',
              borderCollapse: 'collapse',
              fontSize: '9.2px',
              color: '#000000',
              marginBottom: '18px',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: '1px solid #000000',
                    padding: '6px 8px',
                    fontWeight: 400,
                    textAlign: 'center',
                    width: '51%',
                  }}
                >
                  Increased In
                </th>
                <th
                  style={{
                    border: '1px solid #000000',
                    padding: '6px 8px',
                    fontWeight: 400,
                    textAlign: 'center',
                    width: '49%',
                  }}
                >
                  Decreased In
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map(([inc, dec], idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      border: '1px solid #000000',
                      padding: '6px 8px',
                      textAlign: 'center',
                    }}
                  >
                    {inc}
                  </td>
                  <td
                    style={{
                      border: '1px solid #111827',
                      padding: '6px 8px',
                      textAlign: 'center',
                    }}
                  >
                    {dec}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Limitations, Associated Tests, Note, Reference */}
          <div style={{lineHeight: 1.6}}>
            <div style={{marginBottom: '2px'}}>Limitations</div>
            <div style={{paddingLeft: '14px'}}>
              · Glucose levels may be affected by recent food intake, fasting duration, stress, exercise, acute illness, or certain medications such as steroids and antidiabetic drugs.
            </div>
            <div style={{paddingLeft: '14px'}}>
              · Delayed sample processing may lead to falsely low glucose values due to ongoing glucose consumption by blood cells.
            </div>
            <div style={{paddingLeft: '14px', marginBottom: '4px'}}>
              · Hemolysis, improper sample handling, or incorrect patient preparation may influence test accuracy.
            </div>

            <div style={{marginBottom: '2px'}}>Associated Tests</div>
            <div style={{paddingLeft: '14px', marginBottom: '4px'}}>
              · Additional tests such as HbA1c, Oral Glucose Tolerance Test (OGTT), Insulin Levels, C-Peptide, and Urine Glucose may help in further evaluation of glucose metabolism and diabetes status.
            </div>

            <div style={{marginBottom: '2px'}}>Note</div>
            <div style={{paddingLeft: '14px'}}>
              · Fasting status and sample collection timing should be considered while interpreting Glucose Plasma Test results, as reference ranges differ for Fasting, Postprandial (PP), and Random glucose testing.
            </div>
            <div style={{paddingLeft: '14px', marginBottom: '4px'}}>
              · Repeat testing with a fresh sample is recommended if the glucose results do not correlate with the patient’s clinical condition.
            </div>

            <div style={{marginBottom: '2px'}}>Reference</div>
            <div style={{paddingLeft: '14px'}}>· ADA Guidelines 2025 &amp; Pack Insert</div>
          </div>

          <div
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '10px',
              color: '#111827',
              letterSpacing: '0.02em',
            }}
          >
            ---------------------- End Of Report ----------------------
          </div>
        </div>
      </div>

      <ReportFooter pageNumber={3} />
    </div>
  );
}
